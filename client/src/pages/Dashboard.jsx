import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBookings } from '../api/bookings';

const TRIP_LABELS = {
  city: 'City Driving',
  highway: 'Highway Road Trip',
  offroad: 'Off-Road Adventure',
  group: 'Group Travel',
  longtrip: 'Long Trip',
};

const TYPE_COLORS = {
  campervan:  'bg-blue-100 text-blue-700',
  motorhome:  'bg-emerald-100 text-emerald-700',
  offroad:    'bg-orange-100 text-orange-700',
  luxury:     'bg-purple-100 text-purple-700',
  toyhauler:  'bg-amber-100 text-amber-700',
};

const TYPE_LABELS = {
  campervan:  'Camper Van',
  motorhome:  'Motorhome',
  offroad:    'Off-Road RV',
  luxury:     'Luxury RV',
  toyhauler:  'Toy Hauler',
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getBookings()
      .then((res) => setBookings(res.data.bookings))
      .catch(() => setError('Failed to load bookings.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚐</span>
          <h1 className="text-lg font-bold text-blue-600 tracking-tight">SmartRide</h1>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-sm text-gray-500">Hi, <span className="font-medium text-gray-700">{user?.name}</span></span>
          <button onClick={() => navigate('/search')} className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Find RVs
          </button>
          <button onClick={logout} className="text-sm text-gray-400 hover:text-red-500 transition-colors">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
            <p className="text-sm text-gray-500 mt-0.5">All your RV bookings in one place.</p>
          </div>
          <button
            onClick={() => navigate('/search')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            + New Booking
          </button>
        </div>

        {loading && (
          <div className="text-center py-16 text-gray-400 text-sm">Loading bookings...</div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-md text-center py-16 px-8">
            <p className="text-5xl mb-4">🚐</p>
            <p className="text-gray-800 font-semibold text-lg">No bookings yet</p>
            <p className="text-gray-400 text-sm mt-1 mb-6">Start by finding the perfect RV for your next adventure.</p>
            <button
              onClick={() => navigate('/search')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
            >
              Find an RV
            </button>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex gap-0">
                  {/* Image */}
                  <div className="w-36 flex-shrink-0 hidden sm:block">
                    <img
                      src={b.image_url}
                      alt={b.vehicle_name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop'; }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between flex-wrap gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <h3 className="text-base font-bold text-gray-900">{b.vehicle_name}</h3>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[b.vehicle_type] || 'bg-gray-100 text-gray-600'}`}>
                            {TYPE_LABELS[b.vehicle_type] || b.vehicle_type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{b.make} {b.model} · {b.year}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">${b.total_cost.toLocaleString('en-US')}</p>
                        <p className="text-xs text-gray-400">${b.price_per_day.toLocaleString('en-US')} / day</p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                      <InfoChip icon="📅" label="Dates" value={`${formatDate(b.start_date)} – ${formatDate(b.end_date)}`} />
                      <InfoChip icon="📍" label="Pickup" value={b.pickup_location} />
                      <InfoChip icon="🗺️" label="Trip" value={TRIP_LABELS[b.trip_type] || b.trip_type} />
                      <InfoChip icon="👥" label="Seats" value={`${b.passengers} seats · ${b.duration_days} days`} />
                    </div>

                    <p className="text-xs text-gray-400 mt-3">Booking #{b.id} · Booked {formatDate(b.booked_at)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoChip({ icon, label, value }) {
  return (
    <div className="bg-slate-50 rounded-lg px-3 py-2">
      <p className="text-xs text-gray-400 mb-0.5">{icon} {label}</p>
      <p className="text-xs font-semibold text-gray-700 truncate">{value}</p>
    </div>
  );
}
