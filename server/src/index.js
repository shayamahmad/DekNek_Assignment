import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB, getMongoConnectHint } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();
const PORT = process.env.PORT || 5000;

const clientOrigins = [
  ...(process.env.CLIENT_ORIGIN?.split(",")
    .map((s) => s.trim())
    .filter(Boolean) ?? []),
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5175",
].filter(Boolean);
const allowedOrigins = [...new Set(clientOrigins)];

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      cb(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());

function requireMongo(req, res, next) {
  if (mongoose.connection.readyState === 1) return next();
  return res.status(503).json({
    message:
      "Database is not connected. In Atlas → Database → Connect → Drivers, copy your connection string into server/.env as MONGODB_URI (or set MONGODB_USER, MONGODB_PASSWORD, and your real MONGODB_CLUSTER_HOST — not the xxxxx example). Restart the API.",
  });
}

app.use("/api/auth", requireMongo, authRoutes);

const mongoStateLabels = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

app.get("/api/health", (_req, res) => {
  const rs = mongoose.connection.readyState;
  res.json({
    ok: true,
    mongo: {
      connected: rs === 1,
      readyState: rs,
      state: mongoStateLabels[rs] ?? "unknown",
      hint: rs === 1 ? null : getMongoConnectHint(),
    },
  });
});

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on http://localhost:${PORT} (all interfaces)`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use (another Node/API is running). Close that terminal or stop the process, or set PORT=5001 in server/.env`
    );
  } else {
    console.error(err);
  }
});

connectDB().catch(() => {
  console.error(
    "MongoDB did not connect — signup/login will return 503 until Atlas settings match server/.env (real cluster hostname from Connect → Drivers, not cluster0.xxxxx…; DB user password from Database Access). Restart this process after updating .env."
  );
});
