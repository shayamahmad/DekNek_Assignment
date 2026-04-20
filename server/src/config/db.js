import dns from "node:dns";
import mongoose from "mongoose";

let memoryServer = null;

/** Loaded only when USE_IN_MEMORY_DB=true — avoids loading mongodb-memory-server on production hosts (e.g. Render). */
async function getMemoryServer() {
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  return MongoMemoryServer;
}

/** Shown on GET /api/health when MongoDB is not connected (no secrets). */
let mongoConnectHint = null;

export function getMongoConnectHint() {
  return mongoConnectHint;
}

/** Safe flags for /api/health — no secret values. */
export function getMongoEnvDiagnostics() {
  return {
    hasMONGODB_URI: Boolean(trimEnvValue(process.env.MONGODB_URI)),
    hasMONGODB_USER: Boolean(trimEnvValue(process.env.MONGODB_USER)),
    hasMONGODB_PASSWORD:
      process.env.MONGODB_PASSWORD != null && String(process.env.MONGODB_PASSWORD).length > 0,
    hasMONGODB_CLUSTER_HOST: Boolean(trimEnvValue(process.env.MONGODB_CLUSTER_HOST)),
    useInMemoryDB: process.env.USE_IN_MEMORY_DB === "true",
  };
}

function setMongoConnectHint(hint) {
  mongoConnectHint = typeof hint === "string" && hint.trim() ? hint.trim() : null;
}

/** Strips whitespace and surrounding quotes (common when pasting into hosting UIs). */
function trimEnvValue(value) {
  if (value === undefined || value === null) return "";
  let s = String(value).trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

function hintFromDriverError(err, isAtlas) {
  const m = String(err?.message ?? err);
  if (!isAtlas) return m;
  if (/bad auth|authentication failed/i.test(m)) {
    return "Atlas rejected the credentials. Set MONGODB_PASSWORD (or the password inside MONGODB_URI) to match the Database User in Atlas → Database Access — not your Atlas account password.";
  }
  if (/ENOTFOUND|querySrv/i.test(m)) {
    return "Cluster hostname does not resolve. Set MONGODB_URI or MONGODB_CLUSTER_HOST to the real host from Atlas → Database → Connect → Drivers (not the xxxxx example).";
  }
  if (/timed out|ETIMEDOUT|ECONNREFUSED|socket/i.test(m)) {
    return "Cannot reach Atlas. In Atlas → Network Access allow your IP (or 0.0.0.0/0 for dev). Check VPN/firewall; on Windows you can set MONGODB_DNS_SERVERS=8.8.8.8,1.1.1.1.";
  }
  return "Check the MongoDB error in the server terminal, then fix MONGODB_URI or MONGODB_USER+MONGODB_PASSWORD+MONGODB_CLUSTER_HOST in server/.env and restart.";
}

const dnsServers = (process.env.MONGODB_DNS_SERVERS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
if (dnsServers.length) {
  dns.setServers(dnsServers);
}

const defaultOptions = {
  serverSelectionTimeoutMS: 15000,
  maxPoolSize: 10,
};

/**
 * Prefer MONGODB_URI. Or set MONGODB_USER + MONGODB_PASSWORD + MONGODB_CLUSTER_HOST
 * (password is URL-encoded for you — use this if your password has @ # : / ? etc.).
 */
function resolveMongoUri() {
  const direct = trimEnvValue(process.env.MONGODB_URI);
  if (direct) return direct;

  const user = trimEnvValue(process.env.MONGODB_USER);
  const password = process.env.MONGODB_PASSWORD;
  let clusterHost = trimEnvValue(process.env.MONGODB_CLUSTER_HOST);
  if (clusterHost) {
    clusterHost = clusterHost.replace(/^mongodb\+srv:\/\//, "").replace(/\/$/, "");
  }

  if (user && password !== undefined && password !== null && clusterHost) {
    if (String(password).includes("PASTE_YOUR_ATLAS")) {
      const msg =
        "Set MONGODB_PASSWORD in server/.env to your Atlas Database User password (Atlas → Database Access → Edit password).";
      console.error(msg);
      throw new Error(msg);
    }
    const dbName = (process.env.MONGODB_DB_NAME || "auth_app").trim();
    const query =
      process.env.MONGODB_QUERY?.trim() ||
      "retryWrites=true&w=majority&appName=Cluster0";
    const path = dbName ? `/${encodeURIComponent(dbName)}` : "";
    return `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(String(password))}@${clusterHost}${path}?${query}`;
  }

  return null;
}

function assertUriNotAtlasTemplate(uri) {
  if (!uri) return;
  const lower = uri.toLowerCase();
  if (
    lower.includes("cluster0.xxxxx.mongodb.net") ||
    lower.includes("xxxxx.mongodb.net")
  ) {
    throw new Error(
      "MongoDB host is still the Atlas example placeholder (xxxxx). In Atlas → Database → Connect → Drivers, copy your real connection string into server/.env as MONGODB_URI, or set MONGODB_CLUSTER_HOST to your real hostname (e.g. cluster0.ab12cd.mongodb.net)."
    );
  }
}

export async function connectDB() {
  let uri;
  let isAtlas = false;

  if (process.env.USE_IN_MEMORY_DB === "true") {
    setMongoConnectHint(null);
    const dbName = (process.env.MONGODB_DB_NAME || "auth_app").trim() || "auth_app";
    const MongoMemoryServer = await getMemoryServer();
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri(dbName);
    console.log(
      "Using in-memory MongoDB (USE_IN_MEMORY_DB=true). Data is not persisted after the server stops."
    );
  } else {
    try {
      uri = resolveMongoUri();
    } catch (e) {
      setMongoConnectHint(
        "Set MONGODB_PASSWORD in server/.env to your Atlas Database User password (Atlas → Database Access — not your Atlas login)."
      );
      throw e;
    }
    if (!uri) {
      setMongoConnectHint(
        "Add MONGODB_URI (full mongodb+srv://… string from Atlas → Database → Connect → Drivers) or set MONGODB_CLUSTER_HOST to your real cluster hostname. MONGODB_USER and MONGODB_PASSWORD alone are not enough — the app needs a cluster address."
      );
      const msg =
        "Set USE_IN_MEMORY_DB=true for local dev, or set MONGODB_URI / MONGODB_USER+MONGODB_PASSWORD+MONGODB_CLUSTER_HOST (see .env.example).";
      console.error(msg);
      console.error("Mongo env diagnostics (no secrets):", getMongoEnvDiagnostics());
      throw new Error(msg);
    }

    isAtlas = uri.startsWith("mongodb+srv://");
    if (isAtlas) {
      console.log("Connecting to MongoDB Atlas…");
    }
  }

  try {
    assertUriNotAtlasTemplate(uri);
  } catch (e) {
    setMongoConnectHint(String(e.message ?? e));
    throw e;
  }

  try {
    await mongoose.connect(uri, defaultOptions);
    setMongoConnectHint(null);
    const host = mongoose.connection.host;
    console.log(`MongoDB connected${host ? ` (${host})` : ""}`);
  } catch (err) {
    setMongoConnectHint(hintFromDriverError(err, isAtlas));
    console.error("MongoDB connection error:", err.message);
    if (isAtlas) {
      console.error(
        "Atlas checklist: (1) Database Access — user + password must match this URI (not your Atlas website login). (2) Reset the DB user password, copy the new string from Database → Connect → Drivers, or use MONGODB_USER/MONGODB_PASSWORD/MONGODB_CLUSTER_HOST in .env. (3) Network Access — allow your IP or 0.0.0.0/0 for dev."
      );
      if (String(err.message).includes("bad auth")) {
        console.error(
          'Hint: "bad auth" almost always means the password in .env does not match the Database User password in Atlas.'
        );
      }
    }
    throw err;
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });
}
