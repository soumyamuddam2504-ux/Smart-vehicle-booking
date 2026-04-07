const db = require('../db/database');

function recommend({ budget, passengers, tripType, durationDays, filters = {} }) {
  const dailyBudget = Math.floor(budget / durationDays);

  let query = `SELECT * FROM vehicles WHERE capacity >= ? AND price_per_day <= ?`;
  const params = [passengers, dailyBudget];

  if (filters.make) { query += ` AND LOWER(make) = LOWER(?)`; params.push(filters.make); }
  if (filters.model) { query += ` AND LOWER(model) = LOWER(?)`; params.push(filters.model); }
  if (filters.year) { query += ` AND year = ?`; params.push(filters.year); }

  query += ` ORDER BY price_per_day ASC`;

  const vehicles = db.prepare(query).all(...params);

  const scored = vehicles.map((v) => {
    const features = JSON.parse(v.features);
    let score = 0;
    const reasons = [];

    // Budget fit
    const budgetUsage = v.price_per_day / dailyBudget;
    if (budgetUsage >= 0.7) { score += 3; reasons.push('fits your budget well'); }
    else if (budgetUsage >= 0.4) { score += 2; reasons.push('within your budget'); }
    else { score += 1; reasons.push('well under your budget'); }

    // Seat fit
    const extraSeats = v.capacity - passengers;
    if (extraSeats === 0) { score += 3; reasons.push('exact seat match'); }
    else if (extraSeats <= 2) { score += 2; reasons.push('just the right size'); }
    else { score += 1; }

    // Trip type match
    const typeMap = {
      city:     ['campervan', 'motorhome'],
      highway:  ['motorhome', 'luxury', 'campervan'],
      offroad:  ['offroad'],
      group:    ['motorhome', 'luxury', 'toyhauler'],
      longtrip: ['motorhome', 'luxury', 'toyhauler'],
    };
    const preferred = typeMap[tripType] || [];
    if (preferred.includes(v.type)) {
      score += 3;
      const label = {
        city: 'city driving', highway: 'highway road trips',
        offroad: 'off-road adventures', group: 'group travel', longtrip: 'long trips',
      }[tripType] || tripType;
      reasons.push(`great for ${label}`);
    }

    // Multi-day comfort bonus
    if (durationDays >= 3 && features.some(f => /AC|Kitchen|Bath|Bed|WiFi/i.test(f))) {
      score += 1;
      reasons.push('well-equipped for multi-day travel');
    }

    const totalCost = v.price_per_day * durationDays;

    return {
      ...v,
      features,
      score,
      totalCost,
      explanation: `${v.name} is recommended because it ${reasons.join(', ') || 'meets your requirements'}. Total: $${totalCost.toLocaleString('en-US')} for ${durationDays} day${durationDays > 1 ? 's' : ''}.`,
    };
  });

  scored.sort((a, b) => b.score - a.score || a.price_per_day - b.price_per_day);
  return scored.slice(0, 6);
}

module.exports = { recommend };
