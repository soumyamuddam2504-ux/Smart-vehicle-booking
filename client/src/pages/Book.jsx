import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { createBooking } from '../api/bookings';
import { useAuth } from '../context/AuthContext';
import PaymentForm from '../components/PaymentForm';
import Navbar from '../components/Navbar';
import LocationInput from '../components/LocationInput';
import BookingPDF from '../components/BookingPDF';

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

  const [step, setStep] = useState(1);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [tripDetails, setTripDetails] = useState({
    startDate: state?.tripDetails?.startDate || '',
    endDate: state?.tripDetails?.endDate || '',
    pickupLocation: state?.tripDetails?.pickupLocation || '',
  });
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

  const steps = ['Trip Details', 'Payment', 'Confirm'];

  function handleTripNext(e) {
    e.preventDefault();
    setTripError('');
    if (!tripDetails.startDate || !tripDetails.endDate) { setTripError('Please select both start and end dates.'); return; }
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
      const res = await createBooking({
        vehicleId: vehicle.id,
        tripType: searchDetails.tripType,
        durationDays,
        passengers: Number(searchDetails.passengers),
        totalCost,
        startDate: tripDetails.startDate,
        endDate: tripDetails.endDate,
        pickupLocation: tripDetails.pickupLocation,
      });
      setConfirmedBooking({
        id: res.data.bookingId,
        vehicle_name: vehicle.name,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        image_url: vehicle.image_url,
        trip_type: searchDetails.tripType,
        start_date: tripDetails.startDate,
        end_date: tripDetails.endDate,
        duration_days: durationDays,
        passengers: Number(searchDetails.passengers),
        pickup_location: tripDetails.pickupLocation,
        price_per_day: vehicle.price_per_day,
        total_cost: totalCost,
      });
    } catch (err) {
      setBookingError(err.response?.data?.error || 'Booking failed. Please try again.');
      setLoading(false);
    }
  }

  // Success screen
  if (confirmedBooking) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-12 animate-slide-up">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            {/* Green header */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 px-8 py-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Booking Confirmed!</h2>
              <p className="text-emerald-100 text-sm">Reference #{confirmedBooking.id}</p>
            </div>

            {/* Vehicle summary */}
            <div className="p-6">
              <div className="flex gap-4 mb-6 pb-5 border-b border-gray-100">
                <img
                  src={confirmedBooking.image_url}
                  alt={confirmedBooking.vehicle_name}
                  className="w-20 h-16 rounded-xl object-cover flex-shrink-0"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop'; }}
                />
                <div>
                  <p className="font-bold text-gray-900">{confirmedBooking.vehicle_name}</p>
                  <p className="text-sm text-gray-500">{confirmedBooking.make} {confirmedBooking.model} · {confirmedBooking.year}</p>
                  <p className="text-xs text-gray-400 mt-1">{confirmedBooking.pickup_location}</p>
                </div>
              </div>

              {/* Key details */}
              <div className="space-y-2.5 mb-6">
                {[
                  ['Dates',    `${formatDate(confirmedBooking.start_date)} – ${formatDate(confirmedBooking.end_date)}`],
                  ['Duration', `${confirmedBooking.duration_days} day${confirmedBooking.duration_days > 1 ? 's' : ''}`],
                  ['Seats',    `${confirmedBooking.passengers}`],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="text-gray-900 font-semibold">{value}</span>
                  </div>
                ))}
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex justify-between items-center mb-6">
                <span className="text-emerald-700 text-sm font-medium">Total Paid</span>
                <span className="text-xl font-bold text-emerald-800">${confirmedBooking.total_cost.toLocaleString('en-US')}</span>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <PDFDownloadLink
                  document={<BookingPDF booking={confirmedBooking} userName={user?.name} />}
                  fileName={`SmartRide-Booking-${confirmedBooking.id}.pdf`}
                  className="flex-1"
                >
                  {({ loading }) => (
                    <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-sm hover:shadow-md">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {loading ? 'Preparing PDF...' : 'Download Confirmation PDF'}
                    </button>
                  )}
                </PDFDownloadLink>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors"
                >
                  View My Bookings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-xl mx-auto px-4 py-8">
        <button
          onClick={() => (step === 1 ? navigate(-1) : setStep(step - 1))}
          className="text-sm text-blue-600 hover:text-blue-700 mb-6 inline-flex items-center gap-1.5 font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {step === 1 ? 'Back to results' : `Back to ${steps[step - 2]}`}
        </button>

        {/* Step indicator */}
        <div className="flex items-center mb-8">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  i + 1 < step
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : i + 1 === step
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200'
                    : 'bg-white border-gray-200 text-gray-400'
                }`}>
                  {i + 1 < step
                    ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    : i + 1}
                </div>
                <span className={`text-xs mt-1.5 font-semibold ${i + 1 === step ? 'text-blue-600' : i + 1 < step ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 mb-5 rounded-full transition-all ${i + 1 < step ? 'bg-emerald-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Vehicle summary card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-4">
          <div className="flex gap-0">
            <img
              src={vehicle.image_url}
              alt={vehicle.name}
              className="w-28 h-24 object-cover flex-shrink-0"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop'; }}
            />
            <div className="flex-1 px-4 py-3 flex flex-col justify-center">
              <p className="font-bold text-gray-900 text-sm leading-tight">{vehicle.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{vehicle.make} {vehicle.model} &middot; {vehicle.year}</p>
              <p className="text-xs text-gray-400 mt-1">{vehicle.capacity} seats &middot; Sleeps {vehicle.sleeping_capacity}</p>
            </div>
            <div className="px-4 py-3 text-right flex flex-col justify-center flex-shrink-0">
              <p className="text-lg font-bold text-gray-900">${vehicle.price_per_day.toLocaleString('en-US')}</p>
              <p className="text-xs text-gray-400">per day</p>
            </div>
          </div>
        </div>

        {/* Main step card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          {/* Step 1 — Trip Details */}
          {step === 1 && (
            <>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Trip Details</h2>
              <p className="text-sm text-gray-500 mb-5">Confirm your dates and pickup location.</p>
              <form onSubmit={handleTripNext} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Start Date</label>
                    <input
                      type="date"
                      min={today}
                      value={tripDetails.startDate}
                      onChange={(e) => setTripDetails({ ...tripDetails, startDate: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">End Date</label>
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
                  <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-blue-700 font-medium">
                      <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {durationDays} day{durationDays > 1 ? 's' : ''}
                    </div>
                    <p className="text-sm font-bold text-blue-800">
                      Est. total: ${(vehicle.price_per_day * durationDays).toLocaleString('en-US')}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Pickup Location</label>
                  <LocationInput
                    value={tripDetails.pickupLocation}
                    onChange={(val) => setTripDetails({ ...tripDetails, pickupLocation: val })}
                    placeholder="Search city or park..."
                  />
                </div>

                {tripError && (
                  <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">{tripError}</div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-sm hover:shadow-md"
                >
                  Continue to Payment →
                </button>
              </form>
            </>
          )}

          {/* Step 2 — Payment */}
          {step === 2 && (
            <>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Payment Details</h2>
              <p className="text-sm text-gray-500 mb-5">Your payment info is secure and encrypted.</p>
              <PaymentForm totalCost={totalCost} onConfirm={handlePaymentConfirm} />
            </>
          )}

          {/* Step 3 — Confirm */}
          {step === 3 && (
            <>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Confirm Booking</h2>
              <p className="text-sm text-gray-500 mb-5">Review your trip details before confirming.</p>

              <div className="bg-slate-50 rounded-xl p-4 mb-4 space-y-2.5">
                <DetailRow label="Trip Type" value={TRIP_LABELS[searchDetails.tripType] || searchDetails.tripType} />
                <DetailRow label="Start Date" value={formatDate(tripDetails.startDate)} />
                <DetailRow label="End Date" value={formatDate(tripDetails.endDate)} />
                <DetailRow label="Duration" value={`${durationDays} day${durationDays > 1 ? 's' : ''}`} />
                <DetailRow label="No. of Seats" value={searchDetails.passengers} />
                <DetailRow label="Pickup Location" value={tripDetails.pickupLocation} />
                <DetailRow label="Daily Rate" value={`$${vehicle.price_per_day.toLocaleString('en-US')}`} />
              </div>

              <div className="bg-blue-600 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
                <p className="text-blue-200 text-sm font-medium">Total Cost</p>
                <p className="text-2xl font-bold text-white">${totalCost.toLocaleString('en-US')}</p>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-400">Payment via</p>
                    <p className="text-sm font-semibold text-gray-700">{paymentSummary}</p>
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="text-xs text-blue-600 hover:underline font-medium">Change</button>
              </div>

              {bookingError && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{bookingError}</div>
              )}

              <button
                onClick={handleBookingConfirm}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl text-sm transition-all shadow-sm hover:shadow-md disabled:opacity-50"
              >
                {loading ? 'Confirming...' : 'Confirm Booking'}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                By confirming, you agree to our booking terms and cancellation policy.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-semibold">{value}</span>
    </div>
  );
}
