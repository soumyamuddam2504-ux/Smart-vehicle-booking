const nodemailer = require('nodemailer');

// Returns null if Gmail credentials are not configured
function createTransport() {
  const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) return null;

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

async function sendBookingConfirmation({ to, userName, booking }) {
  const transporter = createTransport();
  if (!transporter) {
    console.log('[email] Gmail not configured — skipping confirmation email.');
    return;
  }

  const {
    vehicle_name, make, model, year,
    trip_type, start_date, end_date,
    duration_days, passengers, pickup_location,
    total_cost, price_per_day, bookingId,
  } = booking;

  const TRIP_LABELS = {
    city: 'City Driving', highway: 'Highway Road Trip',
    offroad: 'Off-Road Adventure', group: 'Group Travel', longtrip: 'Long Trip',
  };

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

      <!-- Header -->
      <div style="background:linear-gradient(135deg,#1e40af,#2563eb);padding:32px 36px;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
          <div style="width:36px;height:36px;background:rgba(255,255,255,0.2);border-radius:10px;display:flex;align-items:center;justify-content:center;">
            <span style="color:#fff;font-weight:800;font-size:14px;">SR</span>
          </div>
          <span style="color:#fff;font-weight:700;font-size:18px;letter-spacing:-0.3px;">SmartRide</span>
        </div>
        <h1 style="color:#fff;font-size:24px;font-weight:700;margin:0 0 6px;">Booking Confirmed!</h1>
        <p style="color:#bfdbfe;font-size:14px;margin:0;">Your RV adventure is all set, ${userName}.</p>
      </div>

      <!-- Body -->
      <div style="padding:32px 36px;">

        <!-- Booking ref -->
        <div style="background:#eff6ff;border:1px solid #dbeafe;border-radius:10px;padding:14px 18px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;">
          <span style="color:#3b82f6;font-size:13px;font-weight:600;">Booking Reference</span>
          <span style="color:#1e40af;font-size:15px;font-weight:800;">#${bookingId}</span>
        </div>

        <!-- Vehicle -->
        <h2 style="font-size:16px;font-weight:700;color:#111827;margin:0 0 4px;">${vehicle_name}</h2>
        <p style="font-size:13px;color:#6b7280;margin:0 0 24px;">${make} ${model} &middot; ${year}</p>

        <!-- Details table -->
        <table style="width:100%;border-collapse:collapse;">
          ${[
            ['Trip Type',       TRIP_LABELS[trip_type] || trip_type],
            ['Start Date',      formatDate(start_date)],
            ['End Date',        formatDate(end_date)],
            ['Duration',        `${duration_days} day${duration_days > 1 ? 's' : ''}`],
            ['No. of Seats',    `${passengers}`],
            ['Pickup Location', pickup_location],
            ['Daily Rate',      `$${Number(price_per_day).toLocaleString('en-US')}`],
          ].map(([label, value], i) => `
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:10px 0;font-size:13px;color:#9ca3af;">${label}</td>
              <td style="padding:10px 0;font-size:13px;color:#111827;font-weight:600;text-align:right;">${value}</td>
            </tr>
          `).join('')}
        </table>

        <!-- Total -->
        <div style="background:#2563eb;border-radius:10px;padding:16px 18px;margin-top:20px;display:flex;justify-content:space-between;align-items:center;">
          <span style="color:#bfdbfe;font-size:13px;font-weight:500;">Total Cost</span>
          <span style="color:#fff;font-size:22px;font-weight:800;">$${Number(total_cost).toLocaleString('en-US')}</span>
        </div>

        <p style="font-size:13px;color:#9ca3af;margin:24px 0 0;text-align:center;">
          Questions? Reply to this email or visit your dashboard.
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f9fafb;border-top:1px solid #f3f4f6;padding:16px 36px;text-align:center;">
        <p style="font-size:12px;color:#d1d5db;margin:0;">SmartRide &middot; RV Booking Platform</p>
      </div>
    </div>
  </body>
  </html>
  `;

  try {
    await transporter.sendMail({
      from: `"SmartRide" <${process.env.GMAIL_USER}>`,
      to,
      subject: `Booking Confirmed — ${vehicle_name} (#${bookingId})`,
      html,
    });
    console.log(`[email] Confirmation sent to ${to}`);
  } catch (err) {
    console.error('[email] Failed to send confirmation:', err.message);
    // Do not throw — booking should succeed even if email fails
  }
}

module.exports = { sendBookingConfirmation };
