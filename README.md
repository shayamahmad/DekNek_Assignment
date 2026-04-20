# Full-stack auth app (React + Express + MongoDB)

## One-time setup

From **`project`** (this folder):

```powershell
npm run setup
```

That installs dependencies for the root, `server`, and `client`.

## MongoDB (default: in-memory, no Atlas account)

By default **`server/.env`** has **`USE_IN_MEMORY_DB=true`**. Sign up and login work locally; data is **not kept** after you stop the server.

To verify:

```powershell
cd server
npm run test:db
```

## MongoDB Atlas (optional — persistent cloud database)

Turn off in-memory mode: set **`USE_IN_MEMORY_DB=false`** in **`server/.env`**, then configure Atlas.

The API needs a **Database User** (not your Atlas account login).

1. Open [MongoDB Atlas](https://cloud.mongodb.com) → **Database Access** → create or edit a user → **Edit password** → copy the new password.
2. **Network Access** → **Add IP Address** → **Allow access from anywhere** (`0.0.0.0/0`) for local development, or add your current IP.
3. Edit **`server/.env`**:
   - Set **`MONGODB_PASSWORD`** to that database user’s password (see `server/.env.example` for all options).
   - If you use **`MONGODB_URI`** instead of split vars, paste the full string from **Database → Connect → Drivers** and replace `<password>`.

4. Verify:

```powershell
cd server
npm run test:db
```

You should see **MongoDB connected** and **Database reachable**.

## Run everything (frontend + backend)

From **`project`**:

```powershell
npm run dev
```

- Web UI: URL printed by Vite (usually `http://localhost:5173`).
- API: `http://localhost:5000` (the dev UI proxies `/api` to the API).

Open the app in the browser, wait for the green **MongoDB connected** bar, then sign up.

## Optional: local MongoDB with Docker

If you install Docker Desktop, you can run a local database instead of Atlas:

```powershell
docker compose up -d
```

Then in **`server/.env`** set:

`MONGODB_URI=mongodb://127.0.0.1:27017/auth_app`

(and remove or comment out the Atlas / split-variable settings so only one connection method is active).

---

## Production: Vercel (frontend) + Render (API) + Atlas (database)

Vercel only serves the **React** app. The **Express API** and **MongoDB connection** run on a separate host (below we use [Render](https://render.com); Railway/Fly work similarly).

### 1. MongoDB Atlas

- **Network Access**: allow **`0.0.0.0/0`** so cloud APIs can connect (or add your provider’s IPs later).
- **Database user** + **`MONGODB_URI`**: same as local testing (`npm run test:db` in `server`).

### 2. Deploy the API on Render

1. Push this repo to GitHub (already done if you use it).
2. In Render: **New** → **Blueprint** → connect the repo → use the root **`render.yaml`** (or **Web Service** with **Root Directory** = `server`).
3. **Build**: `npm ci` · **Start**: `npm start` · **Instance**: Free tier is fine (cold starts possible).
4. In **Environment**, add (copy from your working **`server/.env`**):

   | Key | Example |
   | --- | --- |
   | `MONGODB_URI` | `mongodb+srv://...` |
   | `JWT_SECRET` | long random string |
   | `USE_IN_MEMORY_DB` | `false` |
   | `CLIENT_ORIGIN` | `https://YOUR-APP.vercel.app` (your real Vercel URL; add `,http://localhost:5173` if you still test locally against prod API) |

5. **Save** and wait until the service is **Live**. Open `https://YOUR-SERVICE.onrender.com/api/health` — `mongo.connected` should become `true` once Atlas accepts the connection.

### 3. Deploy the frontend on Vercel

1. Import the same GitHub repo; Vercel uses the root **`vercel.json`** (builds `client/` → `client/dist`).
2. **Settings → Environment Variables** → add for **Production** (and **Preview** too if you use preview deployments):

   | Key | Value |
   | --- | --- |
   | `VITE_API_URL` | `https://YOUR-SERVICE.onrender.com` — **no trailing slash** |

3. **Deployments → Redeploy** (or push a commit) so the client **rebuilds** with `VITE_API_URL` baked in. Vite reads this only at **build** time.

4. Locally verify the static build: `npm run build:client` (optional).

### 4. CORS

If the browser blocks requests, confirm **`CLIENT_ORIGIN`** on Render is exactly your Vercel site origin (scheme + host, no path), e.g. `https://dek-nek-assignment.vercel.app`.

### Signup/login returns **405** on Vercel

Usually the SPA sent **`POST /api/...`** to Vercel’s static handler (wrong). The repo’s **`vercel.json`** proxies **`/api/*`** to your Render API — if your Render URL changes, edit that file’s `destination` and redeploy. Alternatively set **`VITE_API_URL`** to your Render base URL (no trailing slash) and **Redeploy** so the client calls Render directly.

You should then see the green **MongoDB connected** bar on the deployed site.

### Render troubleshooting

| Symptom | Fix |
| --- | --- |
| **`Waiting for file changes before restarting`** | Render is running **watch/dev** mode. Open the service → **Settings** → set **Start Command** to **`npm start`** only (not `npm run dev`, not `node --watch`). |
| **`No open ports` / `Port scan timeout`** | The process never listened on `PORT` because it crashed first. Fix the startup error in **Logs** (often wrong **Root Directory** or start command). |
| **`ERR_MODULE_NOT_FOUND`** | **Root Directory** must be **`server`** (the folder that contains `package.json` with `"start": "node src/index.js"`). If Root is the repo root, Render runs the wrong `package.json` and startup breaks. |
| **Node version** | This repo expects **Node 18+**. Blueprint sets `NODE_VERSION=20`; if you created the service manually, set **Environment** → `NODE_VERSION` → `20`. |
| **“cluster address” / `hasMONGODB_URI: false` in `/api/health`** | Render never received **`MONGODB_URI`** (wrong name, wrong service, or not redeployed). Open `https://YOUR-RENDER.onrender.com/api/health` — JSON `mongo.env` shows flags. Key must be exactly **`MONGODB_URI`**. Remove wrapping quotes from the value if you pasted `"mongodb+srv://..."`. **Clear cache / redeploy** after saving env. |
