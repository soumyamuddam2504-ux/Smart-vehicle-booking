const express = require('express');
const db = require('../db/database');
const { requireAuth } = require('../middleware/auth');
const { sendBookingConfirmation } = require('../services/email');

const router = express.Router();

router.post('/', requireAuth, (req, res) => {
  const { vehicleId, tripType, durationDays, passengers, totalCost, startDate, endDate, pickupLocation } = req.body;

  if (!vehicleId || !tripType || !durationDays || !passengers || !totalCost || !startDate || !endDate || !pickupLocation)
    return res.status(400).json({ error: 'All booking fields are required.' });

  const vehicle = db.prepare('SELECT id FROM vehicles WHERE id = ?').get(vehicleId);
  if (!vehicle)
    return res.status(404).json({ error: 'Vehicle not found.' });

  const result = db
    .prepare(
      `INSERT INTO bookings
       (user_id, vehicle_id, trip_type, duration_days, passengers, total_cost, start_date, end_date, pickup_location)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(req.user.userId, vehicleId, tripType, durationDays, passengers, totalCost, startDate, endDate, pickupLocation);

  const bookingId = result.lastInsertRowid;

  // Send confirmation email (fire-and-forget — does not block response)
  const user = db.prepare('SELECT name, email FROM users WHERE id = ?').get(req.user.userId);
  const vehicle = db.prepare('SELECT name, make, model, year, price_per_day FROM vehicles WHERE id = ?').get(vehicleId);
  sendBookingConfirmation({
    to: user.email,
    userName: user.name,
    booking: {
      bookingId,
      vehicle_name: vehicle.name,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      price_per_day: vehicle.price_per_day,
      trip_type: tripType,
      start_date: startDate,
      end_date: endDate,
      duration_days: durationDays,
      passengers,
      pickup_location: pickupLocation,
      total_cost: totalCost,
    },
  });

  res.status(201).json({ bookingId });
});

router.get('/', requireAuth, (req, res) => {
  const bookings = db
    .prepare(
      `SELECT b.id, b.trip_type, b.duration_days, b.passengers, b.total_cost, b.booked_at,
              b.start_date, b.end_date, b.pickup_location,
              v.name AS vehicle_name, v.type AS vehicle_type, v.make, v.model, v.year,
              v.price_per_day, v.capacity, v.image_url
       FROM bookings b
       JOIN vehicles v ON b.vehicle_id = v.id
       WHERE b.user_id = ?
       ORDER BY b.booked_at DESC`
    )
    .all(req.user.userId);

  res.json({ bookings });
});

module.exports = router;
