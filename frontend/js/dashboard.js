if (!Auth.isLoggedIn()) {
  sessionStorage.setItem('redirectAfterLogin', '/dashboard.html');
  window.location.href = '/login.html';
}

const user = Auth.getUser();
const welcomeEl = document.getElementById('welcomeMsg');
const listEl = document.getElementById('bookingsList');

welcomeEl.textContent = `Welcome back, ${user.username}.`;

function fmtDateTime(d) {
  return new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

function bookingHtml(b) {
  const f = b.flightId || {};
  return `
    <div class="booking-card ${b.status}">
      <div>
        <div class="route">
          <span class="flight-number">${f.flightNumber || '—'}</span>
          ${f.origin || '?'} → ${f.destination || '?'}
          <span class="status-badge ${b.status}">${b.status}</span>
        </div>
        <div class="muted" style="font-size:.88rem; margin-top:.25rem;">
          Seat ${b.seatNumber} · Departs ${f.departureTime ? fmtDateTime(f.departureTime) : 'TBD'}<br />
          Booked ${fmtDateTime(b.bookingDate)}
        </div>
      </div>
      <div>
        ${b.status === 'confirmed'
          ? `<button class="small danger" data-cancel="${b._id}">Cancel</button>`
          : ''}
      </div>
    </div>
  `;
}

async function loadBookings() {
  listEl.innerHTML = '<p class="muted">Loading...</p>';
  try {
    const bookings = await api(`/api/bookings/user/${user.id}`);
    if (!bookings.length) {
      listEl.innerHTML = '<p class="muted">You have no bookings yet. <a href="/">Search flights</a> to book one.</p>';
      return;
    }
    listEl.innerHTML = bookings.map(bookingHtml).join('');
    listEl.querySelectorAll('button[data-cancel]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm('Cancel this booking?')) return;
        try {
          await api(`/api/bookings/${btn.dataset.cancel}/cancel`, { method: 'PUT' });
          loadBookings();
        } catch (err) {
          alert(err.message);
        }
      });
    });
  } catch (err) {
    listEl.innerHTML = `<p class="error-msg">Could not load bookings: ${err.message}</p>`;
  }
}

loadBookings();
