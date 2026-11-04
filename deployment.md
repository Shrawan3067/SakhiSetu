# SakhiSetu — Deployment & Operations Guide

This guide details local setup, database provisioning, environment configurations, and production deployment instructions for **SakhiSetu** across Vercel (Frontend), Render / Railway (Backend), and Neon (PostgreSQL).

---

## 1. Local Installation Instructions

### Prerequisites
- **Node.js**: v20+ or v22+ (`node -v`)
- **npm**: v10+ (`npm -v`)
- **PostgreSQL**: v15+ running locally on port 5432 (`psql -l`)

### Step 1: Clone Repository & Install Root Workspaces
```bash
git clone <repo-url>
cd SakhiSetu

# Install dependencies for both server and client workspaces
npm install
```

---

## 2. PostgreSQL Setup

Ensure PostgreSQL is running locally or provision a cloud instance on Neon / Supabase.

```bash
# Create local databases
createdb sakhisetu
createdb sakhisetu_test
```

---

## 3. Environment Variables Configuration

### 3.1 Backend Environment (`server/.env`)
Create `server/.env` based on `server/.env.example`:

```bash
cp server/.env.example server/.env
```

| Variable | Description | Example Value |
|---|---|---|
| `NODE_ENV` | Runtime environment | `development` (or `production`) |
| `PORT` | Backend port | `5001` |
| `CLIENT_URL` | Frontend origin for CORS | `http://localhost:5173` |
| `DATABASE_URL` | Primary PostgreSQL connection string | `postgresql://user:pass@localhost:5432/sakhisetu` |
| `DATABASE_URL_TEST` | Isolated database connection string for tests | `postgresql://user:pass@localhost:5432/sakhisetu_test` |
| `JWT_SECRET` | 32+ character key for JWT signing | `sakhisetu-super-secure-production-jwt-secret-key-32chars` |
| `JWT_ACCESS_EXPIRES_IN` | Token duration | `24h` |
| `OPENAI_API_KEY` | Official OpenAI API Key for Hindi summaries | `sk-proj-...` (optional for local fallback) |
| `OPENAI_MODEL` | OpenAI Model | `gpt-4o-mini` |
| `TRUST_NAME` | Client Trust Name (Demo) | `Company A - SakhiSetu Charitable Trust (Bhopal)` |
| `TRUST_ADDRESS` | Trust Registered Address | `Plot 14, Arera Hills, Bhopal, Madhya Pradesh - 462011` |
| `TRUST_PAN` | Trust PAN | `AAATC1234D` |
| `TRUST_80G_REGISTRATION` | Trust 80G Statutory Registration Number | `CIT(E)/BPL/80G/2021-22/A-1089` |

### 3.2 Frontend Environment (`client/.env`)
Create `client/.env`:
```env
VITE_API_URL=http://localhost:5001/api/v1
```
*(In production, set `VITE_API_URL` to your deployed backend URL, e.g. `https://sakhisetu-api.onrender.com/api/v1`)*

---

## 4. Database Migrations & Seeding

```bash
# 1. Generate Prisma Client
npm run prisma:generate

# 2. Run Database Migrations
npm run prisma:migrate

# 3. Seed Realistic Demonstration Data
npm run prisma:seed
```

### Seeding also for Test Database:
```bash
DATABASE_URL="postgresql://user:pass@localhost:5432/sakhisetu_test" npm --prefix server run prisma:migrate:deploy
DATABASE_URL="postgresql://user:pass@localhost:5432/sakhisetu_test" npm --prefix server run prisma:seed
```

---

## 5. Development Run Commands

You can run both client and server concurrently from the root directory:

```bash
# Run server & client concurrently
npm run dev

# Or run separately in two terminal tabs:
npm run dev:server   # Starts Express on http://localhost:5001
npm run dev:client   # Starts Vite on http://localhost:5173
```

Open your browser to [http://localhost:5173](http://localhost:5173).

---

## 6. Testing Commands

All unit, integration, and critical PostgreSQL concurrency tests pass cleanly:

```bash
# Run all tests (Server and Client)
npm test

# Run Server Tests Only (38 passing tests)
npm run test:server

# Run PostgreSQL Concurrency Tests (Row locking & Atomic sequence verification)
npm --prefix server run test:concurrency

# Run Client Tests
npm run test:client
```

---

## 7. Production Deployment (Vercel + Render + Neon)

### 7.1 PostgreSQL on Neon
1. Create a project at [Neon.tech](https://neon.tech).
2. Copy the pooled connection string `DATABASE_URL`.
3. In your local terminal, apply migrations and seed:
   ```bash
   DATABASE_URL="postgresql://...neon.tech/neondb?sslmode=require" npm --prefix server run prisma:migrate:deploy
   DATABASE_URL="postgresql://...neon.tech/neondb?sslmode=require" npm --prefix server run prisma:seed
   ```

### 7.2 Backend on Render / Railway
1. Create a new **Web Service** pointing to the GitHub repository.
2. Root Directory: `server`
3. Environment: `Node.js`
4. Build Command: `npm install && npm run prisma:generate && npm run build`
5. Start Command: `npm start`
6. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `JWT_SECRET`: Random 32+ character hex string
   - `CLIENT_URL`: Your Vercel frontend URL (e.g. `https://sakhisetu.vercel.app`)
   - `OPENAI_API_KEY`: Your OpenAI key
   - `OPENAI_MODEL`: `gpt-4o-mini`
   - `TRUST_NAME`, `TRUST_ADDRESS`, `TRUST_PAN`, `TRUST_80G_REGISTRATION`

### 7.3 Frontend on Vercel
1. Import your GitHub repository in Vercel.
2. Root Directory: `client`
3. Framework Preset: `Vite`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Environment Variables:
   - `VITE_API_URL`: `https://your-render-backend-url.onrender.com/api/v1`
7. Click **Deploy**.

---

## 8. Demo Accounts & Credentials

Use these documented accounts to demonstrate all role-based journeys:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Trust Administrator** | `admin@sakhisetu.org` | `Admin@123456` | Access admin dashboard, manage schemes, review AI drafts, view donations, export Form 10BD CSV. |
| **Donor 1 (Priya Sharma)** | `priya.sharma@example.com` | `Donor@123456` | View personal donation history, download 80G PDF receipts. |
| **Donor 2 (Rajesh Patel)** | `rajesh.patel@example.com` | `Donor@123456` | View personal recurring donation simulation, download receipts. |
| **Public Visitor** | *(No login required)* | — | Browse schemes, filter by district, run eligibility calculator, make test donations. |

*Quick-fill buttons are provided on the Login page for instant one-click demonstration.*

---

## 9. Troubleshooting & Operations

### Issue: `psql` connection refused during local development
- Check if PostgreSQL service is running:
  ```bash
  brew services list
  # or
  sudo service postgresql status
  ```
- Start PostgreSQL: `brew services start postgresql@18`

### Issue: Prisma Engine Download Timeout
- Run `npm run prisma:generate` directly in `server/`.

### Issue: OpenAI API Rate Limit or Missing Key
- The backend features a built-in safe synthesis fallback that produces structured plain-Hindi drafts without throwing unhandled exceptions.
