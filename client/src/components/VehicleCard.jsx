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

export default function VehicleCard({ vehicle, onBook }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-200">
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={vehicle.image_url}
          alt={vehicle.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop'; }}
        />
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TYPE_COLORS[vehicle.type] || 'bg-gray-100 text-gray-600'}`}>
            {TYPE_LABELS[vehicle.type] || vehicle.type}
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 text-right shadow-sm">
          <p className="text-xs text-gray-400 leading-none">per day</p>
          <p className="text-base font-bold text-gray-800">${vehicle.price_per_day.toLocaleString('en-US')}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Name + Make/Model/Year */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{vehicle.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {vehicle.make} {vehicle.model} · {vehicle.year}
          </p>
        </div>

        {/* Specs row */}
        <div className="flex items-center gap-4 text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2.5">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span><strong>{vehicle.capacity}</strong> seats</span>
          </span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            <span>Sleeps <strong>{vehicle.sleeping_capacity}</strong></span>
          </span>
          <span className="text-gray-300">|</span>
          <span className="font-semibold text-blue-600">${vehicle.totalCost.toLocaleString('en-US')} total</span>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed">{vehicle.description}</p>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5">
          {vehicle.features.map((f) => (
            <span key={f} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-medium">
              {f}
            </span>
          ))}
        </div>

        {/* Explanation */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-3.5 py-2.5 text-sm text-blue-700 italic leading-relaxed">
          {vehicle.explanation}
        </div>

        <button
          onClick={() => onBook(vehicle)}
          className="mt-auto w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors duration-150"
        >
          Book This RV
        </button>
      </div>
    </div>
  );
}
