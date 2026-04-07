import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRecommendations } from '../api/vehicles';
import VehicleCard from '../components/VehicleCard';
import AdvancedFilters from '../components/AdvancedFilters';

const TRIP_TYPES = [
  { value: 'city', label: 'City Driving' },
  { value: 'highway', label: 'Highway Road Trip' },
  { value: 'offroad', label: 'Off-Road Adventure' },
  { value: 'group', label: 'Group Travel' },
  { value: 'longtrip', label: 'Long Trip' },
];

export default function Search() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    budget: '',
    passengers: '',
    tripType: 'highway',
    durationDays: '',
  });
  const [advFilters, setAdvFilters] = useState({ make: '', model: '', year: '' });
  const [results, setResults] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSearch(e) {
    e.preventDefault();
    setError('');
    setResults(null);
    setMessage('');
    setLoading(true);
    try {
      const params = { ...form, ...advFilters };
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚐</span>
          <h1 className="text-lg font-bold text-blue-600 tracking-tight">SmartRide</h1>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-sm text-gray-500">Hi, <span className="font-medium text-gray-700">{user?.name}</span></span>
          <button onClick={() => navigate('/dashboard')} className="text-sm font-medium text-blue-600 hover:text-blue-700">
            My Bookings
          </button>
          <button onClick={logout} className="text-sm text-gray-400 hover:text-red-500 transition-colors">
            Logout
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white px-6 py-10 text-center">
        <h2 className="text-3xl font-bold mb-2">Find Your Perfect RV</h2>
        <p className="text-blue-200 text-sm">Enter your trip details and we'll match you with the best options.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8 -mt-6 relative z-10">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Total Budget ($)</label>
              <input
                type="number"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g. 1500"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">No. of Seats</label>
              <input
                type="number"
                name="passengers"
                value={form.passengers}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g. 4"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Trip Type</label>
              <select
                name="tripType"
                value={form.tripType}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              >
                {TRIP_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Duration (days)</label>
              <input
                type="number"
                name="durationDays"
                value={form.durationDays}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g. 5"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>

            <AdvancedFilters filters={advFilters} onChange={setAdvFilters} />

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 rounded-xl text-sm transition-colors duration-150 disabled:opacity-50"
              >
                {loading ? 'Finding RVs...' : 'Search RVs'}
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">{error}</div>
        )}
        {message && (
          <div className="bg-amber-50 border border-amber-100 text-amber-700 text-sm rounded-xl px-4 py-3 mb-6">{message}</div>
        )}

        {results && results.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-800">
                {results.length} RV{results.length > 1 ? 's' : ''} recommended for you
              </h2>
              <span className="text-sm text-gray-400">Sorted by best match</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((v) => (
                <VehicleCard key={v.id} vehicle={v} onBook={handleBook} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
