import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBookings } from '../api/bookings';
import Navbar from '../components/Navbar';
import DashboardCharts from '../components/DashboardCharts';
import ChatWidget from '../components/ChatWidget';

const TRIP_LABELS = {
  city: 'City Driving',
  highway: 'Highway Road Trip',
  offroad: 'Off-Road Adventure',
  group: 'Group Travel',
  longtrip: 'Long Trip',
};

const TYPE_COLORS = {
  campervan: 'bg-blue-100 text-blue-700',
  motorhome: 'bg-emerald-100 text-emerald-700',
  offroad:   'bg-orange-100 text-orange-700',
  luxury:    'bg-purple-100 text-purple-700',
  toyhauler: 'bg-amber-100 text-amber-700',
};

const TYPE_LABELS = {
  campervan: 'Camper Van',
  motorhome: 'Motorhome',
  offroad:   'Off-Road RV',
  luxury:    'Luxury RV',
  toyhauler: 'Toy Hauler',
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Dashboard() {
  const { user } = useAuth();
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

  const totalSpent = bookings.reduce((sum, b) => sum + b.total_cost, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar activePage="dashboard" />

      {/* Page header */}
      <div className="bg-white border-b border-gray-100 animate-fade-in">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-sm text-gray-500 mt-0.5">All your RV bookings in one place</p>
            </div>
            <div className="flex items-center gap-4">
              {bookings.length > 0 && (
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-400">Total spent</p>
                  <p className="text-lg font-bold text-gray-900">${totalSpent.toLocaleString('en-US')}</p>
                </div>
              )}
              <button
                onClick={() => navigate('/search')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                + New Booking
              </button>
            </div>
          </div>

          {/* Stats row */}
          {bookings.length > 0 && (
            <div className="flex gap-6 mt-5 pt-5 border-t border-gray-100">
              <div>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                <p className="text-xs text-gray-400 mt-0.5">Total Trips</p>
              </div>
              <div className="w-px bg-gray-100" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.reduce((sum, b) => sum + b.duration_days, 0)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Days Booked</p>
              </div>
              <div className="w-px bg-gray-100" />
              <div>
                <p className="text-2xl font-bold text-gray-900 sm:hidden">${totalSpent.toLocaleString('en-US')}</p>
                <p className="text-xs text-gray-400 mt-0.5 sm:hidden">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900 hidden sm:block">
                  {[...new Set(bookings.map((b) => b.vehicle_type))].length}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">RV Types</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <DashboardCharts bookings={bookings} />

        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-400">Loading your bookings...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-md text-center py-20 px-8">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-900 font-bold text-lg mb-1">No bookings yet</p>
            <p className="text-gray-400 text-sm mb-6">Start your adventure by finding the perfect RV for your next trip.</p>
            <button
              onClick={() => navigate('/search')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md"
            >
              Find an RV
            </button>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className="space-y-5">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                <div className="flex">
                  {/* Image */}
                  <div className="w-40 flex-shrink-0 hidden sm:block relative">
                    <img
                      src={b.image_url}
                      alt={b.vehicle_name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-base font-bold text-gray-900">{b.vehicle_name}</h3>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[b.vehicle_type] || 'bg-gray-100 text-gray-600'}`}>
                            {TYPE_LABELS[b.vehicle_type] || b.vehicle_type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{b.make} {b.model} &middot; {b.year}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-2xl font-bold text-gray-900">${b.total_cost.toLocaleString('en-US')}</p>
                        <p className="text-xs text-gray-400">${b.price_per_day.toLocaleString('en-US')} / day</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                      <InfoChip
                        icon={<CalIcon />}
                        label="Dates"
                        value={`${formatDate(b.start_date)} – ${formatDate(b.end_date)}`}
                      />
                      <InfoChip
                        icon={<PinIcon />}
                        label="Pickup"
                        value={b.pickup_location}
                      />
                      <InfoChip
                        icon={<MapIcon />}
                        label="Trip Type"
                        value={TRIP_LABELS[b.trip_type] || b.trip_type}
                      />
                      <InfoChip
                        icon={<UserIcon />}
                        label="Details"
                        value={`${b.passengers} seats · ${b.duration_days} days`}
                      />
                    </div>

                    <p className="text-xs text-gray-400">
                      Booking #{b.id} &middot; Confirmed {formatDate(b.booked_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ChatWidget searchForm={null} results={null} bookings={bookings} />
    </div>
  );
}

function InfoChip({ icon, label, value }) {
  return (
    <div className="bg-slate-50 rounded-xl px-3 py-2.5">
      <div className="flex items-center gap-1 mb-1">
        <span className="text-gray-400 w-3.5 h-3.5">{icon}</span>
        <p className="text-xs text-gray-400">{label}</p>
      </div>
      <p className="text-xs font-semibold text-gray-700 truncate">{value}</p>
    </div>
  );
}

function CalIcon() {
  return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
}
function PinIcon() {
  return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
}
function MapIcon() {
  return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>;
}
function UserIcon() {
  return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
}
