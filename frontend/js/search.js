const resultsEl = document.getElementById('results');
const countEl = document.getElementById('resultsCount');
const form = document.getElementById('searchForm');
const resetBtn = document.getElementById('resetBtn');

const modal = document.getElementById('bookingModal');
const closeModal = document.getElementById('closeModal');
const bookingForm = document.getElementById('bookingForm');
const bookingFlightInfo = document.getElementById('bookingFlightInfo');
const bookingError = document.getElementById('bookingError');
const seatNumberInput = document.getElementById('seatNumber');

let activeFlight = null;

function fmtDateTime(d) {
  return new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

function flightCardHtml(f) {
  const full = f.seatsAvailable < 1;
  return `
    <article class="flight-card">
      <div>
        <div class="route">
          <span class="flight-number">${f.flightNumber}</span>
          ${f.origin} → ${f.destination}
          ${full ? '<span class="full">Sold out</span>' : ''}
        </div>
        <div class="meta">
          Departs ${fmtDateTime(f.departureTime)} · Arrives ${fmtDateTime(f.arrivalTime)}<br />
          ${f.seatsAvailable} of ${f.totalSeats} seats available
        </div>
      </div>
      <div class="right">
        <div class="price">$${Number(f.price).toFixed(2)}</div>
        <button class="small" data-flight-id="${f._id}" ${full ? 'disabled' : ''}>
          ${full ? 'Unavailable' : 'Book Now'}
        </button>
      </div>
    </article>
  `;
}

async function loadFlights(params = {}) {
  resultsEl.innerHTML = '<p class="muted">Loading...</p>';
  countEl.textContent = '';
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) qs.set(k, v);
  try {
    const flights = await api(`/api/flights?${qs.toString()}`);
    if (!flights.length) {
      resultsEl.innerHTML = '<p class="muted">No flights match your search.</p>';
      countEl.textContent = '0 results';
      return;
    }
    countEl.textContent = `${flights.length} result${flights.length === 1 ? '' : 's'}`;
    resultsEl.innerHTML = flights.map(flightCardHtml).join('');
    resultsEl.querySelectorAll('button[data-flight-id]').forEach((btn) => {
      btn.addEventListener('click', () => openBooking(flights.find((f) => f._id === btn.dataset.flightId)));
    });
  } catch (err) {
    resultsEl.innerHTML = `<p class="error-msg">Could not load flights: ${err.message}</p>`;
  }
}

function openBooking(flight) {
  if (!Auth.isLoggedIn()) {
    sessionStorage.setItem('redirectAfterLogin', '/');
    alert('Please log in to book a flight.');
    window.location.href = '/login.html';
    return;
  }
  activeFlight = flight;
  bookingError.textContent = '';
  seatNumberInput.value = '';
  bookingFlightInfo.innerHTML = `
    <p><strong>${flight.flightNumber}</strong> &mdash; ${flight.origin} → ${flight.destination}</p>
    <p class="muted">Departs ${fmtDateTime(flight.departureTime)} · $${Number(flight.price).toFixed(2)}</p>
  `;
  modal.classList.remove('hidden');
}

closeModal.addEventListener('click', () => modal.classList.add('hidden'));
modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });

bookingForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  bookingError.textContent = '';
  const seatNumber = seatNumberInput.value.trim();
  if (!activeFlight || !seatNumber) return;
  try {
    await api('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ flightId: activeFlight._id, seatNumber }),
    });
    modal.classList.add('hidden');
    alert('Booking confirmed! Visit "My Bookings" to manage your reservations.');
    loadFlights(getSearchParams());
  } catch (err) {
    bookingError.textContent = err.message;
  }
});

function getSearchParams() {
  return {
    origin: document.getElementById('origin').value.trim(),
    destination: document.getElementById('destination').value.trim(),
    date: document.getElementById('date').value,
  };
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  loadFlights(getSearchParams());
});

resetBtn.addEventListener('click', () => {
  form.reset();
  loadFlights();
});

loadFlights();
