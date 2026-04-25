# SkyBook Airlines

## Overview
A full-stack airline booking application built to satisfy the "Build a Full Airline Application System with MongoDB and Node.js" project rubric (100 points + bonuses). Customers can search flights, register/log in, and book seats; admins can manage flights via a protected admin panel. The backend is Express + Mongoose; the frontend is multi-page vanilla HTML/CSS/JS served by the same server.

## Project Structure
```
backend/
  config/db.js          # Mongo connection (Atlas-or-memory)
  middleware/auth.js    # JWT verification
  middleware/adminOnly.js # Role check
  models/Flight.js User.js Booking.js
  routes/flights.js users.js bookings.js
  seed.js               # Sample flights + default users
  server.js             # Express entry point
  .env                  # MONGO_URI, JWT_SECRET, PORT
frontend/
  index.html            # Flight search
  login.html register.html
  dashboard.html        # My bookings
  admin.html            # Admin flight management
  styles.css
  js/api.js nav.js search.js login.js register.js dashboard.js admin.js
README.md               # Full project documentation
package.json
```

## Tech Stack
- Node.js 20, Express 4, Mongoose 8
- bcryptjs (password hashing), jsonwebtoken (JWT auth)
- mongodb-memory-server (zero-config local dev fallback)
- Vanilla HTML/CSS/JS frontend (no build step)

## Replit Setup
- **Workflow:** `Start application` runs `npm start` and serves on port `5000` (host `0.0.0.0`).
- **Single-port architecture:** Express serves the API at `/api/*` and static frontend files from `frontend/`.
- **Deployment:** Configured for `autoscale` with run command `npm start`.

## Database
- If `MONGO_URI` is set in `backend/.env` (e.g. a MongoDB Atlas connection string), the app connects to it.
- Otherwise the app spins up an **in-memory MongoDB** automatically — perfect for demos.
- On startup, `seed.js` populates 8 sample flights, an admin user (`admin@airline.test` / `admin123`), and a customer (`demo@airline.test` / `demo1234`).

## Auth Model
- `POST /api/users/register` creates a customer.
- `POST /api/users/login` returns a JWT (24h, signed with `JWT_SECRET`).
- Frontend stores token in `localStorage` and sends `Authorization: Bearer <token>`.
- `auth` middleware verifies the JWT; `adminOnly` further restricts to `role === 'admin'`.
- Customers can only view/cancel their own bookings; admins can do anything.

## API Routes
See `README.md` for the full reference. Highlights:
- `GET /api/flights` (public, supports `?origin=&destination=&date=` filters)
- `POST/PUT/DELETE /api/flights[/:id]` (admin only)
- `POST /api/users/register`, `POST /api/users/login`, `GET /api/users/me`
- `POST /api/bookings`, `GET /api/bookings/user/:id`, `PUT /api/bookings/:id/cancel`

## Recent Changes (April 25, 2026)
- Built the full application to satisfy the project rubric: added auth/admin middleware, role-protected routes, indexes, seed script, in-memory MongoDB fallback, and a 5-page responsive frontend (search, login, register, dashboard, admin).
- Added README.md with full API reference and demo script.

## User Preferences
- Project is due April 27, 2026 at 5:00 PM (extended from the rubric's stated April 15 deadline).
