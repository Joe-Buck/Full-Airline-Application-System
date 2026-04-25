async function checkHealth() {
  const el = document.getElementById('health-status');
  try {
    const res = await fetch('/api/health');
    const data = await res.json();
    if (data.mongo === 'connected') {
      el.innerHTML = '<span class="status-ok">Server OK</span> &mdash; MongoDB connected';
    } else {
      el.innerHTML = '<span class="status-warn">Server OK</span> &mdash; MongoDB not connected (set MONGO_URI in backend/.env)';
    }
  } catch (err) {
    el.innerHTML = '<span class="status-err">Server unreachable</span>';
  }
}

async function loadFlights() {
  const list = document.getElementById('flights-list');
  list.innerHTML = '<li class="muted">Loading...</li>';
  try {
    const res = await fetch('/api/flights');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const flights = await res.json();
    if (!Array.isArray(flights) || flights.length === 0) {
      list.innerHTML = '<li class="muted">No flights available.</li>';
      return;
    }
    list.innerHTML = '';
    flights.forEach((f) => {
      const li = document.createElement('li');
      li.textContent = `${f.flightNumber}: ${f.origin} → ${f.destination} ($${f.price}, seats: ${f.seatsAvailable}/${f.totalSeats})`;
      list.appendChild(li);
    });
  } catch (err) {
    list.innerHTML = `<li class="muted">Could not load flights: ${err.message}</li>`;
  }
}

document.getElementById('refresh-flights').addEventListener('click', loadFlights);
checkHealth();
loadFlights();
