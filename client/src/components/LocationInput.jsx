import { useState, useRef, useEffect } from 'react';

const LOCATIONS = [
  'Denver, CO', 'Colorado Springs, CO', 'Boulder, CO', 'Aspen, CO',
  'Rocky Mountain National Park, CO', 'Mesa Verde, CO',
  'Las Vegas, NV', 'Reno, NV', 'Lake Tahoe, NV',
  'Los Angeles, CA', 'San Francisco, CA', 'San Diego, CA',
  'Yosemite National Park, CA', 'Big Sur, CA', 'Napa Valley, CA',
  'Phoenix, AZ', 'Tucson, AZ', 'Sedona, AZ', 'Flagstaff, AZ',
  'Grand Canyon, AZ', 'Antelope Canyon, AZ',
  'Seattle, WA', 'Portland, OR', 'Eugene, OR', 'Bend, OR',
  'Salt Lake City, UT', 'Moab, UT', 'Zion National Park, UT',
  'Bryce Canyon, UT', 'Arches National Park, UT',
  'Jackson, WY', 'Yellowstone National Park, WY', 'Grand Teton, WY',
  'Bozeman, MT', 'Missoula, MT', 'Glacier National Park, MT',
  'Boise, ID', 'Sun Valley, ID',
  'Albuquerque, NM', 'Santa Fe, NM', 'Taos, NM',
  'Austin, TX', 'San Antonio, TX', 'Dallas, TX', 'Houston, TX',
  'Nashville, TN', 'Memphis, TN', 'Gatlinburg, TN',
  'Smoky Mountains, TN',
  'Miami, FL', 'Orlando, FL', 'Tampa, FL', 'Key West, FL',
  'Atlanta, GA', 'Charlotte, NC', 'Asheville, NC',
  'Chicago, IL', 'Indianapolis, IN', 'Minneapolis, MN', 'Madison, WI',
  'Kansas City, MO', 'St. Louis, MO',
  'New York, NY', 'Boston, MA', 'Washington, DC',
  'Anchorage, AK', 'Denali National Park, AK',
];

export default function LocationInput({ value, onChange, placeholder, className }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || '');
  const containerRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const suggestions = query.trim().length >= 1
    ? LOCATIONS.filter((l) => l.toLowerCase().includes(query.toLowerCase())).slice(0, 7)
    : [];

  function handleChange(e) {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    setOpen(true);
  }

  function handleSelect(loc) {
    setQuery(loc);
    onChange(loc);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder || 'e.g. Denver, CO'}
          autoComplete="off"
          className={`w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all ${className || ''}`}
        />
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-fade-in">
          {suggestions.map((loc) => (
            <button
              key={loc}
              type="button"
              onMouseDown={() => handleSelect(loc)}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-2.5 border-b border-gray-50 last:border-0"
            >
              <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {loc}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
