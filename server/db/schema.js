const db = require('./database');

function createTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          TEXT NOT NULL,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS vehicles (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      name              TEXT NOT NULL,
      type              TEXT NOT NULL,
      make              TEXT NOT NULL,
      model             TEXT NOT NULL,
      year              INTEGER NOT NULL,
      capacity          INTEGER NOT NULL,
      sleeping_capacity INTEGER NOT NULL,
      price_per_day     REAL NOT NULL,
      description       TEXT NOT NULL,
      features          TEXT NOT NULL,
      image_url         TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id         INTEGER NOT NULL REFERENCES users(id),
      vehicle_id      INTEGER NOT NULL REFERENCES vehicles(id),
      trip_type       TEXT NOT NULL,
      duration_days   INTEGER NOT NULL,
      passengers      INTEGER NOT NULL,
      total_cost      REAL NOT NULL,
      start_date      TEXT NOT NULL,
      end_date        TEXT NOT NULL,
      pickup_location TEXT NOT NULL,
      booked_at       DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

module.exports = { createTables };
