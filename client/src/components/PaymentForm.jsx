import { useState } from 'react';

const PAYMENT_METHODS = [
  { value: 'credit', label: 'Credit Card' },
  { value: 'debit', label: 'Debit Card' },
  { value: 'paypal', label: 'PayPal' },
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
      const digits = card.number.replace(/\s/g, '');
      if (digits.length !== 16) return 'Card number must be 16 digits.';
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
      {/* Payment method selector */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Payment Method</p>
        <div className="flex gap-3">
          {PAYMENT_METHODS.map((m) => (
            <button
              type="button"
              key={m.value}
              onClick={() => { setMethod(m.value); setError(''); }}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition ${
                method === m.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Card fields */}
      {(method === 'credit' || method === 'debit') && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
            <input
              type="text"
              name="name"
              value={card.name}
              onChange={handleCardChange}
              placeholder="Soumya Reddy"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
            <input
              type="text"
              name="number"
              value={card.number}
              onChange={handleCardChange}
              placeholder="4242 4242 4242 4242"
              inputMode="numeric"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
              <input
                type="text"
                name="expiry"
                value={card.expiry}
                onChange={handleCardChange}
                placeholder="MM/YY"
                inputMode="numeric"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input
                type="password"
                name="cvv"
                value={card.cvv}
                onChange={handleCardChange}
                placeholder="•••"
                inputMode="numeric"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* PayPal field */}
      {method === 'paypal' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PayPal Email</label>
          <input
            type="email"
            value={paypalEmail}
            onChange={(e) => setPaypalEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>
      )}

      <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-400">Total due today</p>
          <p className="text-xl font-bold text-gray-800">${totalCost.toLocaleString('en-US')}</p>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition"
        >
          Continue to Review →
        </button>
      </div>
    </form>
  );
}
