# SkyBook Airlines — Full-Stack Airline Booking System

A complete airline booking application built with **Node.js**, **Express**, **MongoDB (Mongoose)**, and a vanilla **HTML/CSS/JS** frontend. Implements every requirement from the project rubric: database modeling, RESTful CRUD APIs, JWT-based authentication with role-based access control, a multi-page responsive frontend, and cloud-ready deployment configuration.

---

## Features

### For Customers
- Search flights by origin, destination, and date
- Register and log in (passwords hashed with bcrypt)
- Book a seat on any available flight
- View personal bookings and cancel reservations from a dashboard

### For Admins
- Full CRUD over flights via an admin panel (create, view, delete)
- Protected admin-only routes via JWT + role middleware

### Technical
- Mongoose schemas with validation, indexes, and `ObjectId` references
- JWT authentication middleware (`/backend/middleware/auth.js`)
- Role-based authorization middleware (`/backend/middleware/adminOnly.js`)
- Sample-data seeding script (`/backend/seed.js`) auto-runs on first start
- In-memory MongoDB fallback for zero-config local development
- Responsive CSS UI with a 5-page flow: search → login/register → dashboard → admin

---

## Project Structure

```
airline-app/
├── backend/
│   ├── config/db.js          # Mongo connection (Atlas or in-memory)
│   ├── middleware/
│   │   ├── auth.js           # JWT verification
│   │   └── adminOnly.js      # Role check
│   ├── models/
│   │   ├── Flight.js
│   │   ├── User.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── flights.js
│   │   ├── users.js
│   │   └── bookings.js
│   ├── seed.js               # Sample data + default users
│   ├── server.js             # Express entry point
│   └── .env                  # MONGO_URI / JWT_SECRET / PORT
├── frontend/
│   ├── index.html            # Flight search
│   ├── login.html            # Log in
│   ├── register.html         # Register
│   ├── dashboard.html        # My bookings
│   ├── admin.html            # Admin flight management
│   ├── styles.css
│   └── js/
│       ├── api.js, nav.js, search.js, login.js, register.js, dashboard.js, admin.js
└── package.json
```

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Run the app
```bash
npm start
```
The server starts on **port 5000**, serving both the API at `/api/*` and the frontend at `/`.

> If you do not set `MONGO_URI`, the app spins up an **in-memory MongoDB** automatically — perfect for local demos. To use a persistent **MongoDB Atlas** database, edit `backend/.env` and set:
> ```
> MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/airlineDB
> ```

### 3. Default seeded accounts
| Role     | Email                  | Password   |
|----------|------------------------|------------|
| Admin    | `admin@airline.test`   | `admin123` |
| Customer | `demo@airline.test`    | `demo1234` |

8 sample flights are also seeded automatically.

---

## API Reference

### Flights
| Method | Endpoint                | Auth        | Description                                     |
|--------|-------------------------|-------------|-------------------------------------------------|
| GET    | `/api/flights`          | public      | List flights (filter via `?origin=&destination=&date=`) |
| GET    | `/api/flights/:id`      | public      | Get one flight                                  |
| POST   | `/api/flights`          | admin       | Create a flight                                 |
| PUT    | `/api/flights/:id`      | admin       | Update a flight                                 |
| DELETE | `/api/flights/:id`      | admin       | Delete a flight                                 |

### Users
| Method | Endpoint               | Auth   | Description                            |
|--------|------------------------|--------|----------------------------------------|
| POST   | `/api/users/register`  | public | Register a new customer                |
| POST   | `/api/users/login`     | public | Authenticate, returns JWT              |
| GET    | `/api/users/me`        | user   | Current user profile                   |
| GET    | `/api/users`           | admin  | List all users                         |

### Bookings
| Method | Endpoint                          | Auth          | Description                       |
|--------|-----------------------------------|---------------|-----------------------------------|
| GET    | `/api/bookings`                   | admin         | List all bookings                 |
| GET    | `/api/bookings/user/:id`          | self or admin | Bookings for a specific user      |
| GET    | `/api/bookings/:id`               | self or admin | Booking details                   |
| POST   | `/api/bookings`                   | user          | Create a booking                  |
| PUT    | `/api/bookings/:id/cancel`        | self or admin | Cancel a booking (frees the seat) |
| DELETE | `/api/bookings/:id`               | admin         | Hard-delete                       |

### Health
- `GET /api/health` → `{ status, mongo }`

---

## Auth flow

1. Client calls `POST /api/users/login` with email/password.
2. Server verifies bcrypt hash, signs a JWT (`{ id, role, username }`, 24h).
3. Client stores token in `localStorage` and sends `Authorization: Bearer <token>` on protected calls.
4. Server middleware verifies the token; admin routes additionally check `role === 'admin'`.

---

## Deployment

The project is configured for autoscale deployment on Replit:
- Run command: `npm start`
- Port: `5000`

For Atlas:
1. Create a free M0 cluster at [mongodb.com/atlas](https://mongodb.com/atlas).
2. Add `MONGO_URI` to your Replit Secrets / `backend/.env`.
3. Set `JWT_SECRET` to a strong random string.
4. Publish.

---

## Demo Script

1. Open the app → see the seeded flights on the search page.
2. Click **Register**, create a new customer account (auto-logs you in).
3. Search for a route (e.g. JFK → LAX), click **Book Now**, enter seat `12A`.
4. Open **My Bookings** to see the confirmed reservation; cancel it to free the seat.
5. Log out, log in as `admin@airline.test` / `admin123`.
6. Open **Admin**, add a new flight; delete an existing one.

---

## Tech Stack

- **Backend:** Node.js 20, Express 4, Mongoose 8
- **Auth:** bcryptjs, jsonwebtoken
- **Database:** MongoDB (Atlas-ready, in-memory fallback via `mongodb-memory-server`)
- **Frontend:** Vanilla HTML5, CSS3, ES6 JavaScript (no build step)
