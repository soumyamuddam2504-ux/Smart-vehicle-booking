import { useState } from 'react';

const MAKES_AND_MODELS = {
  'Winnebago':       ['Travato', 'Revel', 'Solis', 'Minnie Winnie', 'Vista', 'Intent'],
  'Thor Motor Coach':['Axis', 'Vegas', 'Compass', 'Magnitude', 'Sequence', 'Gemini'],
  'Forest River':    ['Sunseeker', 'Georgetown', 'Berkshire', 'Salem', 'Rockwood', 'Flagstaff'],
  'Coachmen':        ['Leprechaun', 'Freelander', 'Pursuit', 'Beyond', 'Nova', 'Encore'],
  'EarthRoamer':     ['XV-HD', 'XV-LTS', 'LTi'],
  'Newmar':          ['King Aire', 'Dutch Star', 'Bay Star', 'Ventana', 'Kountry Star', 'London Aire'],
  'Keystone':        ['Carbon', 'Cougar', 'Montana', 'Passport', 'Springdale', 'Bullet'],
  'Tiffin':          ['Allegro Bus', 'Allegro Red', 'Phaeton', 'Wayfarer', 'Breeze', 'Open Road'],
  'Airstream':       ['Interstate', 'Atlas', 'Classic', 'Bambi', 'Caravel', 'Flying Cloud'],
  'Fleetwood':       ['Bounder', 'Storm', 'Flair', 'Discovery', 'Pace Arrow', 'Fortis'],
  'Jayco':           ['Precept', 'Greyhawk', 'Alante', 'Eagle', 'White Hawk', 'Redhawk'],
  'Leisure Travel':  ['Unity', 'Wonder', 'Serenity', 'Free', 'Plateau'],
};

const MAKES = Object.keys(MAKES_AND_MODELS).sort();
const YEARS = ['2025', '2024', '2023', '2022', '2021', '2020'];

export default function AdvancedFilters({ filters, onChange }) {
  const [open, setOpen] = useState(false);
  const hasActive = filters.make || filters.model || filters.year;
  const activeCount = [filters.make, filters.model, filters.year].filter(Boolean).length;

  const models = filters.make ? (MAKES_AND_MODELS[filters.make] || []) : [];

  function handleMakeChange(e) {
    onChange({ ...filters, make: e.target.value, model: '' });
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-600"
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Advanced Filters
          {hasActive && (
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
              {activeCount} active
            </span>
          )}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="p-4 bg-white border-t border-gray-100 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Make */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Make
              </label>
              <select
                value={filters.make}
                onChange={handleMakeChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              >
                <option value="">Any Make</option>
                {MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Model — dynamic based on make */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Model
              </label>
              {filters.make ? (
                <select
                  value={filters.model}
                  onChange={(e) => onChange({ ...filters, model: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                >
                  <option value="">Any Model</option>
                  {models.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              ) : (
                <input
                  type="text"
                  value={filters.model}
                  onChange={(e) => onChange({ ...filters, model: e.target.value })}
                  placeholder="Select a make first"
                  disabled
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
                />
              )}
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Year
              </label>
              <select
                value={filters.year}
                onChange={(e) => onChange({ ...filters, year: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              >
                <option value="">Any Year</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {hasActive && (
            <button
              type="button"
              onClick={() => onChange({ make: '', model: '', year: '' })}
              className="mt-3 text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
