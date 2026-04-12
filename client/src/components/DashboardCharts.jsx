import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

const TYPE_LABELS = {
  campervan: 'Camper Van',
  motorhome: 'Motorhome',
  offroad:   'Off-Road RV',
  luxury:    'Luxury RV',
  toyhauler: 'Toy Hauler',
};

const PIE_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function StatCard({ label, value, sub, color = 'blue' }) {
  const colors = {
    blue:   { bg: 'bg-blue-50',   text: 'text-blue-700',   val: 'text-blue-900' },
    green:  { bg: 'bg-emerald-50', text: 'text-emerald-700', val: 'text-emerald-900' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', val: 'text-purple-900' },
    amber:  { bg: 'bg-amber-50',  text: 'text-amber-700',  val: 'text-amber-900' },
  };
  const c = colors[color] || colors.blue;
  return (
    <div className={`${c.bg} rounded-2xl p-5`}>
      <p className={`text-xs font-semibold uppercase tracking-wide ${c.text} mb-1`}>{label}</p>
      <p className={`text-2xl font-bold ${c.val}`}>{value}</p>
      {sub && <p className={`text-xs ${c.text} mt-0.5`}>{sub}</p>}
    </div>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2 text-sm">
        <p className="font-semibold text-gray-800">{payload[0].name}</p>
        <p className="text-gray-500">{payload[0].value} booking{payload[0].value !== 1 ? 's' : ''}</p>
      </div>
    );
  }
  return null;
};

const BarTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2 text-sm">
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-blue-600 font-medium">${Number(payload[0].value).toLocaleString('en-US')}</p>
      </div>
    );
  }
  return null;
};

export default function DashboardCharts({ bookings }) {
  if (!bookings || bookings.length < 1) return null;

  const totalSpent = bookings.reduce((sum, b) => sum + b.total_cost, 0);
  const totalDays  = bookings.reduce((sum, b) => sum + b.duration_days, 0);
  const avgCost    = Math.round(totalSpent / bookings.length);

  // RV type distribution for pie chart
  const typeCounts = bookings.reduce((acc, b) => {
    const label = TYPE_LABELS[b.vehicle_type] || b.vehicle_type;
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));

  // Per-booking spend for bar chart (last 6)
  const barData = [...bookings].slice(0, 6).reverse().map((b) => ({
    name: b.vehicle_name.length > 12 ? b.vehicle_name.slice(0, 12) + '…' : b.vehicle_name,
    cost: b.total_cost,
  }));

  return (
    <div className="mb-8 animate-fade-in">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Trip Summary</h2>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Trips"   value={bookings.length}  color="blue" />
        <StatCard label="Total Spent"   value={`$${totalSpent.toLocaleString('en-US')}`} color="green" />
        <StatCard label="Days Booked"   value={totalDays}        color="purple" />
        <StatCard label="Avg. per Trip" value={`$${avgCost.toLocaleString('en-US')}`}    color="amber" />
      </div>

      {/* Charts — only show when 2+ bookings */}
      {bookings.length >= 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pie chart — RV types */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm font-bold text-gray-700 mb-4">RV Types Booked</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="flex flex-wrap gap-2 mt-2">
              {pieData.map((entry, i) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  {entry.name}
                </div>
              ))}
            </div>
          </div>

          {/* Bar chart — spend per booking */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm font-bold text-gray-700 mb-4">Spend per Booking</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `$${v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}`} />
                <Tooltip content={<BarTooltip />} cursor={{ fill: '#eff6ff' }} />
                <Bar dataKey="cost" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
