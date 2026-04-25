# Flight Booking App

## Overview
A simple flight booking application with an Express.js backend and a static HTML/CSS/JS frontend. The backend exposes a REST API for flights, users, and bookings, backed by MongoDB via Mongoose.

## Project Structure
- `backend/` — Express server (`server.js`), `models/` (Mongoose schemas: User, Flight, Booking), `routes/` (flights, users, bookings), and `.env`.
- `frontend/` — Static site (`index.html`, `styles.css`, `app.js`) served by Express.
- `package.json` — Node dependencies and `npm start` script.

## Tech Stack
- Node.js 20
- Express 4
- Mongoose 8 (MongoDB)
- bcryptjs, jsonwebtoken (auth helpers)
- Plain HTML/CSS/JS frontend (no build step)

## Replit Setup
- **Workflow:** `Start application` runs `npm start` and serves on port `5000` (host `0.0.0.0`).
- **Frontend** is served statically by Express from `/frontend`, so a single port (5000) hosts both API and UI.
- **Deployment:** Configured for `autoscale` with run command `npm start`.

## Configuration
- `backend/.env` holds:
  - `MONGO_URI` — MongoDB connection string (currently the placeholder `your_mongodb_atlas_connection_string`; replace with a real Atlas URI to enable database features).
  - `PORT` — defaults to 5000.
  - `JWT_SECRET` — token signing secret.
- The server starts even if `MONGO_URI` is not configured; database-backed routes will return a 500 until a valid URI is set.
- Mongoose buffering is disabled (`mongoose.set('bufferCommands', false)`) so requests fail fast when disconnected instead of timing out.

## API Routes
- `GET /api/health` — health check (server + mongo state).
- `GET/POST/PUT/DELETE /api/flights[/:id]` — flight CRUD.
- `POST /api/users/register`, `POST /api/users/login`, `GET /api/users` — auth and listing.
- `GET/POST /api/bookings`, `GET /api/bookings/:id`, `PUT /api/bookings/:id/cancel`, `DELETE /api/bookings/:id` — bookings.

## Notes
- To enable database functionality, set `MONGO_URI` in `backend/.env` to a valid MongoDB connection string.
