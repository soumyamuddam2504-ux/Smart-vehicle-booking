# Skills & Technologies

## Frontend
- **React** — Component-based UI library
- **Vite** — Fast development build tool
- **Tailwind CSS** — Utility-first CSS framework for rapid styling
- **React Router** — Client-side routing (Login, Signup, Search, Dashboard pages)

## Backend
- **Node.js** — JavaScript runtime for the server
- **Express** — Lightweight REST API framework

## Authentication
- **JWT (jsonwebtoken)** — Stateless token-based authentication
- **bcrypt** — Password hashing

## Database
- **SQLite** (via better-sqlite3) — Zero-config, file-based database for MVP
- **Drizzle ORM** — Type-safe, lightweight ORM for SQLite

## Core Features & Logic
- **Vehicle Recommendation Engine** — Ranks mock vehicles based on user input (budget, passengers, trip type, duration) with plain-language explanations
- **Booking System** — Allows users to select and confirm a vehicle booking
- **User Dashboard** — Displays all bookings for the authenticated user

## Development Tools
- **Git** — Version control
- **npm** — Package manager
- **VS Code / Claude Code** — Development environment

## Data
- **Mock/Static Data** — Vehicle dataset used for MVP; no external data source required

## Architectural Approach
- Modular folder structure (client / server separation)
- REST API between frontend and backend
- JWT stored client-side for protected routes
- Recommendation logic isolated in a dedicated service module
