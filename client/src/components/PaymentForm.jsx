import { useState } from 'react';

const PAYMENT_METHODS = [
  { value: 'credit', label: 'Credit Card', icon: '💳' },
  { value: 'debit', label: 'Debit Card', icon: '🏦' },
  { value: 'paypal', label: 'PayPal', icon: '🅿' },
];

export default function PaymentForm({ totalCost, onConfirm }) {
  const [method, setMethod] = useState('credit');
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [paypalEmail, setPaypalEmail] = useState('');
  const [error, setError] = useState('');

  function handleCardChange(e) {
    const { name, value } = e.target;
    if (name === 'number') {
      const digits = value.replace(/\D/g, '').slice(0, 16);
      const formatted = digits.replace(/(.{4})/g, '$1 ').trim();
      setCard({ ...card, number: formatted });
      return;
    }
    if (name === 'expiry') {
      const digits = value.replace(/\D/g, '').slice(0, 4);
      const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
      setCard({ ...card, expiry: formatted });
      return;
    }
    if (name === 'cvv') {
      setCard({ ...card, cvv: value.replace(/\D/g, '').slice(0, 4) });
      return;
    }
    setCard({ ...card, [name]: value });
  }

  function validate() {
    if (method === 'paypal') {
      if (!paypalEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalEmail))
        return 'Please enter a valid PayPal email address.';
    } else {
      if (!card.name.trim()) return 'Name on card is required.';
      if (card.number.replace(/\s/g, '').length !== 16) return 'Card number must be 16 digits.';
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) return 'Expiry must be in MM/YY format.';
      if (card.cvv.length < 3) return 'CVV must be 3 or 4 digits.';
    }
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    const summary =
      method === 'paypal'
        ? `PayPal (${paypalEmail})`
        : `${method === 'credit' ? 'Credit' : 'Debit'} card ending in ${card.number.replace(/\s/g, '').slice(-4)}`;
    onConfirm(summary);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Method selector */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Payment Method</p>
        <div className="grid grid-cols-3 gap-2">
          {PAYMENT_METHODS.map((m) => (
            <button
              type="button"
              key={m.value}
              onClick={() => { setMethod(m.value); setError(''); }}
              className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-semibold transition-all ${
                method === m.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Card fields */}
      {(method === 'credit' || method === 'debit') && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Name on Card</label>
            <input
              type="text"
              name="name"
              value={card.name}
              onChange={handleCardChange}
              placeholder="Full name as on card"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Card Number</label>
            <input
              type="text"
              name="number"
              value={card.number}
              onChange={handleCardChange}
              placeholder="4242 4242 4242 4242"
              inputMode="numeric"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 tracking-widest"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Expiry</label>
              <input
                type="text"
                name="expiry"
                value={card.expiry}
                onChange={handleCardChange}
                placeholder="MM/YY"
                inputMode="numeric"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">CVV</label>
              <input
                type="password"
                name="cvv"
                value={card.cvv}
                onChange={handleCardChange}
                placeholder="•••"
                inputMode="numeric"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
          </div>
        </div>
      )}

      {/* PayPal */}
      {method === 'paypal' && (
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">PayPal Email</label>
          <input
            type="email"
            value={paypalEmail}
            onChange={(e) => setPaypalEmail(e.target.value)}
            placeholder="your-paypal@example.com"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Total due today</p>
          <p className="text-2xl font-bold text-gray-900">${totalCost.toLocaleString('en-US')}</p>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-sm hover:shadow-md"
        >
          Review Booking →
        </button>
      </div>
    </form>
  );
}
