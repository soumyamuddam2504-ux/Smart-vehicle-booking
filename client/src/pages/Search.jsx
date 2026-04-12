import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecommendations } from '../api/vehicles';
import VehicleCard from '../components/VehicleCard';
import AdvancedFilters from '../components/AdvancedFilters';
import Navbar from '../components/Navbar';
import LocationInput from '../components/LocationInput';
import ChatWidget from '../components/ChatWidget';

const TRIP_TYPES = [
  { value: 'city',     label: 'City Driving' },
  { value: 'highway',  label: 'Highway Road Trip' },
  { value: 'offroad',  label: 'Off-Road Adventure' },
  { value: 'group',    label: 'Group Travel' },
  { value: 'longtrip', label: 'Long Trip' },
  { value: 'other',    label: 'Other...' },
];

const SEAT_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];
const BUDGET_MIN = 500;
const BUDGET_MAX = 10000;
const BUDGET_STEP = 100;

function calcDays(start, end) {
  if (!start || !end) return 0;
  const diff = new Date(end) - new Date(start);
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function Search() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    budget: 2000,
    passengers: '',
    tripType: 'highway',
    customTripType: '',
    durationDays: '',
    startDate: '',
    endDate: '',
    pickupLocation: '',
  });
  const [advFilters, setAdvFilters] = useState({ make: '', model: '', year: '' });
  const [results, setResults] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    const updated = { ...form, [e.target.name]: e.target.value };
    if (e.target.name === 'startDate' || e.target.name === 'endDate') {
      const days = calcDays(
        e.target.name === 'startDate' ? e.target.value : updated.startDate,
        e.target.name === 'endDate'   ? e.target.value : updated.endDate
      );
      if (days > 0) updated.durationDays = String(days);
    }
    setForm(updated);
  }

  async function handleSearch(e) {
    e.preventDefault();
    setError('');
    setResults(null);
    setMessage('');
    setLoading(true);
    try {
      const tripType = form.tripType === 'other'
        ? (form.customTripType.trim() || 'other')
        : form.tripType;

      const params = {
        budget: form.budget,
        passengers: form.passengers,
        tripType,
        durationDays: form.durationDays,
        ...advFilters,
      };
      const res = await getRecommendations(params);
      setResults(res.data.vehicles);
      if (res.data.message) setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch recommendations.');
    } finally {
      setLoading(false);
    }
  }

  function handleBook(vehicle) {
    navigate('/book', { state: { vehicle, tripDetails: form } });
  }

  const durationDays = calcDays(form.startDate, form.endDate);
  const sliderPercent = ((form.budget - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar activePage="search" />

      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=1600&auto=format&fit=crop"
          alt="Open road adventure"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/70 via-blue-900/60 to-blue-800/80" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 animate-fade-in">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-3">
            Smart Vehicle Matching
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-3">
            Find Your Perfect RV
          </h1>
          <p className="text-blue-200 text-sm md:text-base max-w-md">
            Tell us about your trip and we'll match you with the best vehicles for your adventure.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16">
        {/* Search form card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 -mt-10 relative z-10 animate-slide-up">
          <h2 className="text-sm font-bold text-gray-700 mb-6 flex items-center gap-2 uppercase tracking-wide">
            <span className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            Search Criteria
          </h2>

          <form onSubmit={handleSearch} className="space-y-5">

            {/* Budget slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Total Budget
                </label>
                <span className="text-lg font-bold text-blue-600">
                  ${Number(form.budget).toLocaleString('en-US')}
                </span>
              </div>
              <input
                type="range"
                name="budget"
                min={BUDGET_MIN}
                max={BUDGET_MAX}
                step={BUDGET_STEP}
                value={form.budget}
                onChange={handleChange}
                className="w-full"
                style={{
                  background: `linear-gradient(to right, #2563eb 0%, #2563eb ${sliderPercent}%, #e2e8f0 ${sliderPercent}%, #e2e8f0 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>$500</span>
                <span>$10,000</span>
              </div>
            </div>

            {/* Seats + Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  No. of Seats
                </label>
                <select
                  name="passengers"
                  value={form.passengers}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all"
                >
                  <option value="">Select seats</option>
                  {SEAT_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'seat' : 'seats'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Duration (days)
                  {durationDays > 0 && (
                    <span className="ml-2 text-blue-500 normal-case font-medium">auto-calculated</span>
                  )}
                </label>
                <input
                  type="number"
                  name="durationDays"
                  value={form.durationDays}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="e.g. 5"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all"
                />
              </div>
            </div>

            {/* Trip Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Trip Type
                </label>
                <select
                  name="tripType"
                  value={form.tripType}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all"
                >
                  {TRIP_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              {form.tripType === 'other' && (
                <div className="animate-fade-in">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Describe Your Trip
                  </label>
                  <input
                    type="text"
                    name="customTripType"
                    value={form.customTripType}
                    onChange={handleChange}
                    placeholder="e.g. Beach camping, Festival trip..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all"
                  />
                </div>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  min={today}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  min={form.startDate || today}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all"
                />
              </div>
            </div>

            {/* Duration pill */}
            {durationDays > 0 && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 flex items-center justify-between animate-fade-in">
                <span className="text-sm text-blue-700 font-medium">
                  {durationDays} day{durationDays > 1 ? 's' : ''} selected
                </span>
                <span className="text-sm font-bold text-blue-800">
                  Est. daily: ${Math.round(form.budget / durationDays).toLocaleString('en-US')} / day
                </span>
              </div>
            )}

            {/* Pickup Location */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Pickup Location
              </label>
              <LocationInput
                value={form.pickupLocation}
                onChange={(val) => setForm({ ...form, pickupLocation: val })}
                placeholder="Search city or park..."
              />
            </div>

            {/* Advanced Filters */}
            <AdvancedFilters filters={advFilters} onChange={setAdvFilters} />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3.5 rounded-xl text-sm transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Finding your perfect RV...
                </span>
              ) : 'Search Available RVs'}
            </button>
          </form>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mt-6 animate-fade-in">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl px-4 py-3 mt-6 flex items-start gap-2 animate-fade-in">
            <span className="text-amber-500 mt-0.5 flex-shrink-0">ⓘ</span> {message}
          </div>
        )}

        {/* Results */}
        {results && results.length > 0 && (
          <div className="mt-10 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {results.length} RV{results.length > 1 ? 's' : ''} matched your trip
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">Sorted by best match for your preferences</p>
              </div>
              <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100 hidden sm:inline">
                Best Match First
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((v, i) => (
                <VehicleCard key={v.id} vehicle={v} onBook={handleBook} rank={i + 1} />
              ))}
            </div>
          </div>
        )}

        {results && results.length === 0 && !message && (
          <div className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-md text-center py-16 px-8 animate-fade-in">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-800 font-semibold text-lg">No RVs found</p>
            <p className="text-gray-400 text-sm mt-1">Try increasing your budget or reducing the number of seats.</p>
          </div>
        )}
      </div>

      <ChatWidget searchForm={form} results={results} bookings={[]} />
    </div>
  );
}
