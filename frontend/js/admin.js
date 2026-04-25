if (!Auth.isLoggedIn() || !Auth.isAdmin()) {
  alert('Admin access required.');
  window.location.href = '/login.html';
}

const tableEl = document.getElementById('flightsTable');
const form = document.getElementById('newFlightForm');
const errEl = document.getElementById('newFlightError');

function fmtDateTime(d) {
  return new Date(d).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
}

async function loadFlights() {
  tableEl.innerHTML = '<p class="muted">Loading flights...</p>';
  try {
    const flights = await api('/api/flights');
    if (!flights.length) {
      tableEl.innerHTML = '<p class="muted">No flights yet.</p>';
      return;
    }
    tableEl.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Flight #</th><th>Route</th><th>Departs</th><th>Seats</th><th>Price</th><th></th>
          </tr>
        </thead>
        <tbody>
          ${flights.map((f) => `
            <tr>
              <td><strong>${f.flightNumber}</strong></td>
              <td>${f.origin} → ${f.destination}</td>
              <td>${fmtDateTime(f.departureTime)}</td>
              <td>${f.seatsAvailable}/${f.totalSeats}</td>
              <td>$${Number(f.price).toFixed(2)}</td>
              <td><button class="small danger" data-del="${f._id}">Delete</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    tableEl.querySelectorAll('button[data-del]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this flight permanently?')) return;
        try {
          await api(`/api/flights/${btn.dataset.del}`, { method: 'DELETE' });
          loadFlights();
        } catch (err) {
          alert(err.message);
        }
      });
    });
  } catch (err) {
    tableEl.innerHTML = `<p class="error-msg">Could not load flights: ${err.message}</p>`;
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errEl.textContent = '';
  const body = {
    flightNumber: document.getElementById('flightNumber').value.trim(),
    origin: document.getElementById('origin').value.trim(),
    destination: document.getElementById('destination').value.trim(),
    departureTime: document.getElementById('departureTime').value,
    arrivalTime: document.getElementById('arrivalTime').value,
    totalSeats: Number(document.getElementById('totalSeats').value),
    seatsAvailable: Number(document.getElementById('seatsAvailable').value),
    price: Number(document.getElementById('price').value),
  };
  try {
    await api('/api/flights', { method: 'POST', body: JSON.stringify(body) });
    form.reset();
    loadFlights();
  } catch (err) {
    errEl.textContent = err.message;
  }
});

loadFlights();
