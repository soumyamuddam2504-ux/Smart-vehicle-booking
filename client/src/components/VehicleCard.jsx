const TYPE_COLORS = {
  campervan:  'bg-blue-100 text-blue-700 border-blue-200',
  motorhome:  'bg-emerald-100 text-emerald-700 border-emerald-200',
  offroad:    'bg-orange-100 text-orange-700 border-orange-200',
  luxury:     'bg-purple-100 text-purple-700 border-purple-200',
  toyhauler:  'bg-amber-100 text-amber-700 border-amber-200',
};

const TYPE_LABELS = {
  campervan:  'Camper Van',
  motorhome:  'Motorhome',
  offroad:    'Off-Road RV',
  luxury:     'Luxury RV',
  toyhauler:  'Toy Hauler',
};

const RANK_BADGES = {
  1: { label: 'Best Match', color: 'bg-amber-400 text-amber-900' },
  2: { label: 'Great Pick', color: 'bg-blue-500 text-white' },
  3: { label: 'Top Choice', color: 'bg-emerald-500 text-white' },
};

export default function VehicleCard({ vehicle, onBook, rank }) {
  const rankBadge = RANK_BADGES[rank];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group animate-slide-up">
      {/* Image */}
      <div className="relative h-52 bg-gray-100 overflow-hidden">
        <img
          src={vehicle.image_url}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop'; }}
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Type badge — top left */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${TYPE_COLORS[vehicle.type] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
            {TYPE_LABELS[vehicle.type] || vehicle.type}
          </span>
        </div>

        {/* Rank badge — top right */}
        {rankBadge && (
          <div className="absolute top-3 right-3">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${rankBadge.color}`}>
              #{rank} {rankBadge.label}
            </span>
          </div>
        )}

        {/* Price — bottom right */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-md text-right">
          <p className="text-xs text-gray-400 leading-none">per day</p>
          <p className="text-lg font-bold text-gray-900 leading-tight">${vehicle.price_per_day.toLocaleString('en-US')}</p>
        </div>

        {/* Total cost — bottom left */}
        <div className="absolute bottom-3 left-3 bg-blue-600/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-md">
          <p className="text-xs text-blue-200 leading-none">est. total</p>
          <p className="text-sm font-bold text-white leading-tight">${vehicle.totalCost.toLocaleString('en-US')}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3.5 flex-1">
        {/* Name + Make/Model */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{vehicle.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{vehicle.make} {vehicle.model} &middot; {vehicle.year}</p>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-50 rounded-xl px-3 py-2 text-center">
            <p className="text-xs text-gray-400 mb-0.5">Seats</p>
            <p className="text-sm font-bold text-gray-800">{vehicle.capacity}</p>
          </div>
          <div className="bg-slate-50 rounded-xl px-3 py-2 text-center">
            <p className="text-xs text-gray-400 mb-0.5">Sleeps</p>
            <p className="text-sm font-bold text-gray-800">{vehicle.sleeping_capacity}</p>
          </div>
          <div className="bg-slate-50 rounded-xl px-3 py-2 text-center">
            <p className="text-xs text-gray-400 mb-0.5">Year</p>
            <p className="text-sm font-bold text-gray-800">{vehicle.year}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{vehicle.description}</p>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5">
          {vehicle.features.slice(0, 5).map((f) => (
            <span key={f} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-medium">
              {f}
            </span>
          ))}
          {vehicle.features.length > 5 && (
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-lg font-medium">
              +{vehicle.features.length - 5} more
            </span>
          )}
        </div>

        {/* Match explanation */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-3.5 py-2.5 flex gap-2">
          <span className="text-blue-400 mt-0.5 flex-shrink-0">✦</span>
          <p className="text-sm text-blue-700 leading-relaxed">{vehicle.explanation}</p>
        </div>

        {/* CTA */}
        <button
          onClick={() => onBook(vehicle)}
          className="mt-auto w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-sm hover:shadow-md"
        >
          Book This RV →
        </button>
      </div>
    </div>
  );
}
