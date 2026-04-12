import {
  Document, Page, Text, View, StyleSheet, Image, Font,
} from '@react-pdf/renderer';

const TRIP_LABELS = {
  city: 'City Driving', highway: 'Highway Road Trip',
  offroad: 'Off-Road Adventure', group: 'Group Travel', longtrip: 'Long Trip',
};

function fmt(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

const s = StyleSheet.create({
  page:         { backgroundColor: '#f8fafc', padding: 0, fontFamily: 'Helvetica' },
  header:       { backgroundColor: '#2563eb', padding: '28 36', flexDirection: 'column' },
  logoRow:      { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  logoBadge:    { width: 32, height: 32, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8,
                  alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  logoText:     { color: '#fff', fontSize: 11, fontFamily: 'Helvetica-Bold' },
  brandName:    { color: '#fff', fontSize: 16, fontFamily: 'Helvetica-Bold', letterSpacing: 0.3 },
  headerTitle:  { color: '#fff', fontSize: 22, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  headerSub:    { color: '#bfdbfe', fontSize: 11 },

  body:         { padding: '24 36' },

  refBox:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                  backgroundColor: '#eff6ff', borderRadius: 8, padding: '10 14', marginBottom: 20 },
  refLabel:     { color: '#3b82f6', fontSize: 11, fontFamily: 'Helvetica-Bold' },
  refValue:     { color: '#1e40af', fontSize: 13, fontFamily: 'Helvetica-Bold' },

  vehicleImage: { width: '100%', height: 160, borderRadius: 10, objectFit: 'cover', marginBottom: 14 },

  vehicleName:  { fontSize: 15, fontFamily: 'Helvetica-Bold', color: '#111827', marginBottom: 3 },
  vehicleSub:   { fontSize: 11, color: '#6b7280', marginBottom: 18 },

  divider:      { borderBottomWidth: 1, borderBottomColor: '#f3f4f6', marginBottom: 8 },

  row:          { flexDirection: 'row', justifyContent: 'space-between',
                  paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  rowLabel:     { fontSize: 11, color: '#9ca3af' },
  rowValue:     { fontSize: 11, color: '#111827', fontFamily: 'Helvetica-Bold' },

  totalBox:     { backgroundColor: '#2563eb', borderRadius: 10, padding: '14 16',
                  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                  marginTop: 16 },
  totalLabel:   { color: '#bfdbfe', fontSize: 12 },
  totalValue:   { color: '#fff', fontSize: 20, fontFamily: 'Helvetica-Bold' },

  footer:       { backgroundColor: '#f9fafb', borderTopWidth: 1, borderTopColor: '#f3f4f6',
                  padding: '14 36', alignItems: 'center', marginTop: 'auto' },
  footerText:   { fontSize: 10, color: '#d1d5db' },
});

export default function BookingPDF({ booking, userName }) {
  const {
    id, vehicle_name, make, model, year, image_url,
    trip_type, start_date, end_date, duration_days,
    passengers, pickup_location, price_per_day, total_cost,
  } = booking;

  const rows = [
    ['Trip Type',       TRIP_LABELS[trip_type] || trip_type],
    ['Start Date',      fmt(start_date)],
    ['End Date',        fmt(end_date)],
    ['Duration',        `${duration_days} day${duration_days > 1 ? 's' : ''}`],
    ['No. of Seats',    String(passengers)],
    ['Pickup Location', pickup_location],
    ['Daily Rate',      `$${Number(price_per_day).toLocaleString('en-US')}`],
  ];

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.logoRow}>
            <View style={s.logoBadge}>
              <Text style={s.logoText}>SR</Text>
            </View>
            <Text style={s.brandName}>SmartRide</Text>
          </View>
          <Text style={s.headerTitle}>Booking Confirmed!</Text>
          <Text style={s.headerSub}>Your RV adventure is all set, {userName}.</Text>
        </View>

        {/* Body */}
        <View style={s.body}>
          {/* Booking ref */}
          <View style={s.refBox}>
            <Text style={s.refLabel}>Booking Reference</Text>
            <Text style={s.refValue}>#{id}</Text>
          </View>

          {/* Vehicle image */}
          {image_url && (
            <Image
              src={image_url}
              style={s.vehicleImage}
            />
          )}

          {/* Vehicle name */}
          <Text style={s.vehicleName}>{vehicle_name}</Text>
          <Text style={s.vehicleSub}>{make} {model} · {year}</Text>

          {/* Detail rows */}
          {rows.map(([label, value]) => (
            <View key={label} style={s.row}>
              <Text style={s.rowLabel}>{label}</Text>
              <Text style={s.rowValue}>{value}</Text>
            </View>
          ))}

          {/* Total */}
          <View style={s.totalBox}>
            <Text style={s.totalLabel}>Total Cost</Text>
            <Text style={s.totalValue}>${Number(total_cost).toLocaleString('en-US')}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>SmartRide · RV Booking Platform · Thank you for booking with us</Text>
        </View>
      </Page>
    </Document>
  );
}
