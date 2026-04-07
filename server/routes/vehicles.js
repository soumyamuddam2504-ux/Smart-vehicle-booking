const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { recommend } = require('../services/recommend');

const router = express.Router();

router.get('/recommend', requireAuth, (req, res) => {
  const { budget, passengers, tripType, durationDays, make, model, year } = req.query;

  if (!budget || !passengers || !tripType || !durationDays)
    return res.status(400).json({ error: 'Budget, seats, trip type, and duration are required.' });

  const results = recommend({
    budget: Number(budget),
    passengers: Number(passengers),
    tripType,
    durationDays: Number(durationDays),
    filters: {
      make: make || null,
      model: model || null,
      year: year ? Number(year) : null,
    },
  });

  if (results.length === 0)
    return res.json({
      vehicles: [],
      message: 'No RVs found matching your criteria. Try increasing your budget, adjusting filters, or reducing the number of seats.',
    });

  res.json({ vehicles: results });
});

module.exports = router;
