# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Smart Vehicle Match & Booking Platform — users sign up, enter trip needs (budget, passengers, vehicle type, duration), and get ranked vehicle recommendations with explanations. Users can book vehicles and view bookings in a dashboard. MVP uses mock/seeded vehicle data.

## Workflow

Always follow this workflow for every task:

1. Do NOT start coding immediately
2. First understand the requirement
3. Break it into steps
4. Explain what you will build
5. Ask for confirmation
6. Only proceed after the user says "proceed"

## Commands

### Backend (`server/`)
```bash
npm run dev       # Start server with hot reload (node --watch)
npm start         # Start server (production)
```
Server runs on `http://localhost:3001`. DB is auto-created and seeded on first run.

### Frontend (`client/`)
```bash
npm run dev       # Start Vite dev server at http://localhost:5173
npm run build     # Production build
```

### First-time setup
```bash
cd server && npm install
cd ../client && npm install
```

## Architecture

```
client/   React + Vite + Tailwind CSS (frontend)
server/   Node.js + Express (REST API)
```

**Frontend pages** (`client/src/pages/`):
- `Login.jsx` / `Signup.jsx` — auth forms, store JWT in localStorage
- `Search.jsx` — trip input form + recommendation results
- `Book.jsx` — booking confirmation page
- `Dashboard.jsx` — all bookings for logged-in user

**Auth flow**: JWT stored in localStorage, injected via Axios interceptor in `api/vehicles.js` and `api/bookings.js`. `AuthContext.jsx` provides `user`, `saveAuth`, and `logout` globally.

**Backend routes** (`server/routes/`):
- `POST /api/auth/signup` / `POST /api/auth/login`
- `GET /api/vehicles/recommend?budget&passengers&tripType&durationDays` (JWT required)
- `POST /api/bookings` / `GET /api/bookings` (JWT required)

**Recommendation logic** (`server/services/recommend.js`): filters by passenger capacity and daily budget, then scores vehicles on budget fit, seat match, trip type alignment, and multi-day comfort. Returns top 6 results with plain-language explanations.

## Data Layer

SQLite database at `server/db/app.db` (gitignored). Three tables: `users`, `vehicles`, `bookings`.

- Schema: `server/db/schema.js`
- Seed (runs once on startup): `server/db/seed.js` — inserts test user and 10 mock vehicles
- Test user: `soumyareddy9989+1@gmail.com` / `Soumya@123`
