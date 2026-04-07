import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createBooking } from '../api/bookings';
import { useAuth } from '../context/AuthContext';
import PaymentForm from '../components/PaymentForm';

const TRIP_LABELS = {
  city: 'City Driving',
  highway: 'Highway Road Trip',
  offroad: 'Off-Road Adventure',
  group: 'Group Travel',
  longtrip: 'Long Trip',
};

function calcDays(start, end) {
  if (!start || !end) return 0;
  const diff = new Date(end) - new Date(start);
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Book() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1); // 1 = trip details, 2 = payment, 3 = confirm
  const [tripDetails, setTripDetails] = useState({ startDate: '', endDate: '', pickupLocation: '' });
  const [tripError, setTripError] = useState('');
  const [paymentSummary, setPaymentSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  if (!state?.vehicle) {
    navigate('/search', { replace: true });
    return null;
  }

  const { vehicle, tripDetails: searchDetails } = state;
  const durationDays = calcDays(tripDetails.startDate, tripDetails.endDate);
  const totalCost = vehicle.price_per_day * (durationDays || Number(searchDetails.durationDays));

  const today = new Date().toISOString().split('T')[0];

  function handleTripNext(e) {
    e.preventDefault();
    setTripError('');
    if (!tripDetails.startDate || !tripDetails.endDate) { setTripError('Please select start and end dates.'); return; }
    if (tripDetails.endDate <= tripDetails.startDate) { setTripError('End date must be after start date.'); return; }
    if (!tripDetails.pickupLocation.trim()) { setTripError('Please enter a pickup location.'); return; }
    setStep(2);
  }

  function handlePaymentConfirm(summary) {
    setPaymentSummary(summary);
    setStep(3);
  }

  async function handleBookingConfirm() {
    setBookingError('');
    setLoading(true);
    try {
      await createBooking({
        vehicleId: vehicle.id,
        tripType: searchDetails.tripType,
        durationDays,
        passengers: Number(searchDetails.passengers),
        totalCost,
        startDate: tripDetails.startDate,
        endDate: tripDetails.endDate,
        pickupLocation: tripDetails.pickupLocation,
      });
      navigate('/dashboard');
    } catch (err) {
      setBookingError(err.response?.data?.error || 'Booking failed. Please try again.');
      setLoading(false);
    }
  }

  const steps = ['Trip Details', 'Payment', 'Confirm'];

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚐</span>
          <h1 className="text-lg font-bold text-blue-600 tracking-tight">SmartRide</h1>
        </div>
        <span className="text-sm text-gray-500">Hi, <span className="font-medium text-gray-700">{user?.name}</span></span>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-10">
        <button
          onClick={() => (step === 1 ? navigate(-1) : setStep(step - 1))}
          className="text-sm text-blue-600 hover:underline mb-6 inline-flex items-center gap-1"
        >
          ← {step === 1 ? 'Back to results' : `Back to ${steps[step - 2]}`}
        </button>

        {/* Step indicator */}
        <div className="flex items-center mb-8">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  i + 1 < step ? 'bg-green-500 border-green-500 text-white'
                  : i + 1 === step ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-200 text-gray-400'
                }`}>
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs mt-1 font-medium ${i + 1 === step ? 'text-blue-600' : 'text-gray-400'}`}>{label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 ${i + 1 < step ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          {/* Vehicle summary — always visible */}
          <div className="flex gap-4 mb-6 pb-5 border-b border-gray-100">
            <img
              src={vehicle.image_url}
              alt={vehicle.name}
              className="w-20 h-16 rounded-xl object-cover flex-shrink-0"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop'; }}
            />
            <div>
              <p className="font-bold text-gray-900">{vehicle.name}</p>
              <p className="text-sm text-gray-500">{vehicle.make} {vehicle.model} · {vehicle.year}</p>
              <p className="text-sm text-gray-500">{vehicle.capacity} seats · Sleeps {vehicle.sleeping_capacity}</p>
            </div>
          </div>

          {/* Step 1 — Trip Details */}
          {step === 1 && (
            <>
              <h2 className="text-lg font-bold text-gray-800 mb-4">Trip Details</h2>
              <form onSubmit={handleTripNext} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Date</label>
                    <input
                      type="date"
                      min={today}
                      value={tripDetails.startDate}
                      onChange={(e) => setTripDetails({ ...tripDetails, startDate: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">End Date</label>
                    <input
                      type="date"
                      min={tripDetails.startDate || today}
                      value={tripDetails.endDate}
                      onChange={(e) => setTripDetails({ ...tripDetails, endDate: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    />
                  </div>
                </div>

                {durationDays > 0 && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 text-sm text-blue-700 font-medium">
                    {durationDays} day{durationDays > 1 ? 's' : ''} · Estimated total: <strong>${(vehicle.price_per_day * durationDays).toLocaleString('en-US')}</strong>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pickup Location</label>
                  <input
                    type="text"
                    value={tripDetails.pickupLocation}
                    onChange={(e) => setTripDetails({ ...tripDetails, pickupLocation: e.target.value })}
                    placeholder="e.g. Denver, CO"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  />
                </div>

                {tripError && (
                  <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">{tripError}</div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
                >
                  Continue to Payment →
                </button>
              </form>
            </>
          )}

          {/* Step 2 — Payment */}
          {step === 2 && (
            <>
              <h2 className="text-lg font-bold text-gray-800 mb-4">Payment Details</h2>
              <PaymentForm totalCost={totalCost} onConfirm={handlePaymentConfirm} />
            </>
          )}

          {/* Step 3 — Confirm */}
          {step === 3 && (
            <>
              <h2 className="text-lg font-bold text-gray-800 mb-1">Confirm Booking</h2>
              <p className="text-sm text-gray-500 mb-5">Review everything before confirming.</p>

              <div className="space-y-2.5 mb-5">
                <DetailRow label="Trip Type" value={TRIP_LABELS[searchDetails.tripType] || searchDetails.tripType} />
                <DetailRow label="Start Date" value={formatDate(tripDetails.startDate)} />
                <DetailRow label="End Date" value={formatDate(tripDetails.endDate)} />
                <DetailRow label="Duration" value={`${durationDays} day${durationDays > 1 ? 's' : ''}`} />
                <DetailRow label="No. of Seats" value={searchDetails.passengers} />
                <DetailRow label="Pickup Location" value={tripDetails.pickupLocation} />
                <DetailRow label="Rate" value={`$${vehicle.price_per_day.toLocaleString('en-US')} / day`} />
                <div className="border-t border-gray-100 pt-3 mt-1">
                  <DetailRow label="Total Cost" value={`$${totalCost.toLocaleString('en-US')}`} bold />
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Payment via</p>
                  <p className="text-sm font-semibold text-gray-700">{paymentSummary}</p>
                </div>
                <button onClick={() => setStep(2)} className="text-xs text-blue-600 hover:underline">Change</button>
              </div>

              {bookingError && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{bookingError}</div>
              )}

              <button
                onClick={handleBookingConfirm}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                {loading ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, bold }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={bold ? 'font-bold text-gray-900 text-base' : 'text-gray-800 font-medium'}>{value}</span>
    </div>
  );
}
