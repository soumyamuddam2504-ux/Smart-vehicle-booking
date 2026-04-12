import { useState, useRef, useEffect } from 'react';

// Rule-based recommendation assistant
// Analyses search context and booking history to give smart suggestions

function generateTips({ searchForm, results, bookings }) {
  const tips = [];

  if (searchForm) {
    const { budget, passengers, tripType, durationDays } = searchForm;
    const dailyBudget = budget && durationDays ? Math.floor(budget / durationDays) : null;

    if (results !== null && results.length === 0) {
      tips.push({
        type: 'warning',
        text: 'No RVs found. Try increasing your budget or reducing the number of seats to see more options.',
      });
    }

    if (dailyBudget && dailyBudget < 120) {
      tips.push({
        type: 'tip',
        text: `Your daily budget is ~$${dailyBudget}. Camper vans typically start at $120/day and are the most affordable option.`,
      });
    }

    if (tripType === 'offroad') {
      tips.push({
        type: 'tip',
        text: 'For off-road trips, look for vehicles with 4WD, high clearance, and solar panels for off-grid capability.',
      });
    }

    if (tripType === 'longtrip' || Number(durationDays) >= 7) {
      tips.push({
        type: 'tip',
        text: 'For trips 7+ days, prioritise RVs with a full kitchen, bathroom, and AC to stay comfortable.',
      });
    }

    if (tripType === 'group' || Number(passengers) >= 5) {
      tips.push({
        type: 'tip',
        text: 'Travelling with 5+ people? Class A motorhomes and toy haulers offer the most space and sleeping capacity.',
      });
    }

    if (results && results.length > 0) {
      const top = results[0];
      tips.push({
        type: 'match',
        text: `Top pick: "${top.name}" — ${top.explanation}`,
      });
    }
  }

  if (bookings && bookings.length > 0) {
    const mostBooked = bookings.reduce((acc, b) => {
      acc[b.vehicle_type] = (acc[b.vehicle_type] || 0) + 1;
      return acc;
    }, {});
    const favType = Object.entries(mostBooked).sort((a, b) => b[1] - a[1])[0]?.[0];
    if (favType) {
      const labels = { campervan: 'Camper Van', motorhome: 'Motorhome', offroad: 'Off-Road RV', luxury: 'Luxury RV', toyhauler: 'Toy Hauler' };
      tips.push({
        type: 'history',
        text: `Based on your booking history, you tend to prefer ${labels[favType] || favType}s. Consider filtering by this type for faster results.`,
      });
    }
  }

  if (tips.length === 0) {
    tips.push({
      type: 'tip',
      text: 'Fill in your trip details above and I\'ll help you find the best RV match for your adventure!',
    });
  }

  return tips;
}

const ICON = {
  tip:     { bg: 'bg-blue-50',   text: 'text-blue-700',   icon: '💡' },
  warning: { bg: 'bg-amber-50',  text: 'text-amber-800',  icon: '⚠️' },
  match:   { bg: 'bg-emerald-50', text: 'text-emerald-800', icon: '✦' },
  history: { bg: 'bg-purple-50', text: 'text-purple-800', icon: '📋' },
};

export default function ChatWidget({ searchForm, results, bookings }) {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const tips = generateTips({ searchForm, results, bookings });

  if (dismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      {open && (
        <div className="w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">SR</span>
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-none">SmartRide Assistant</p>
                <p className="text-blue-200 text-xs mt-0.5">Recommendations & tips</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-blue-200 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tips */}
          <div className="p-3 space-y-2 max-h-72 overflow-y-auto">
            {tips.map((tip, i) => {
              const style = ICON[tip.type] || ICON.tip;
              return (
                <div key={i} className={`${style.bg} rounded-xl px-3 py-2.5 flex gap-2`}>
                  <span className="text-sm flex-shrink-0 mt-0.5">{style.icon}</span>
                  <p className={`text-xs leading-relaxed ${style.text}`}>{tip.text}</p>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">Smart rule-based assistant</p>
            <button
              onClick={() => { setDismissed(true); setOpen(false); }}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-13 h-13 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center relative"
        title="SmartRide Assistant"
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        )}
        {/* Pulse dot */}
        {!open && tips.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
        )}
      </button>
    </div>
  );
}
