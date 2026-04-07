import { useState } from 'react';

const MAKES = [
  'Winnebago', 'Thor Motor Coach', 'Forest River', 'Coachmen',
  'EarthRoamer', 'Newmar', 'Keystone', 'Tiffin',
];

const YEARS = ['2024', '2023', '2022', '2021', '2020'];

export default function AdvancedFilters({ filters, onChange }) {
  const [open, setOpen] = useState(false);

  const hasActive = filters.make || filters.model || filters.year;

  return (
    <div className="sm:col-span-2 border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition text-sm font-medium text-gray-600"
      >
        <span className="flex items-center gap-2">
          Advanced Filters
          {hasActive && (
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold">
              Active
            </span>
          )}
        </span>
        <span className="text-gray-400">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-white border-t border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
            <select
              value={filters.make}
              onChange={(e) => onChange({ ...filters, make: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any Make</option>
              {MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
            <input
              type="text"
              value={filters.model}
              onChange={(e) => onChange({ ...filters, model: e.target.value })}
              placeholder="e.g. Travato"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              value={filters.year}
              onChange={(e) => onChange({ ...filters, year: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any Year</option>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          {hasActive && (
            <div className="sm:col-span-3">
              <button
                type="button"
                onClick={() => onChange({ make: '', model: '', year: '' })}
                className="text-sm text-red-500 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
