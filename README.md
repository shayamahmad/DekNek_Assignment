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
