const bcrypt = require('bcryptjs');
const Flight = require('./models/Flight');
const User = require('./models/User');

const SAMPLE_FLIGHTS = [
  { flightNumber: 'AA-1042', origin: 'New York (JFK)', destination: 'Los Angeles (LAX)', departureTime: '2026-05-15T08:30:00Z', arrivalTime: '2026-05-15T11:45:00Z', totalSeats: 180, seatsAvailable: 42, price: 349.99 },
  { flightNumber: 'DL-2201', origin: 'Atlanta (ATL)', destination: 'Miami (MIA)', departureTime: '2026-05-16T07:00:00Z', arrivalTime: '2026-05-16T09:15:00Z', totalSeats: 160, seatsAvailable: 90, price: 199.5 },
  { flightNumber: 'UA-815', origin: 'San Francisco (SFO)', destination: 'Chicago (ORD)', departureTime: '2026-05-17T14:20:00Z', arrivalTime: '2026-05-17T20:40:00Z', totalSeats: 200, seatsAvailable: 110, price: 289.0 },
  { flightNumber: 'BA-178', origin: 'New York (JFK)', destination: 'London (LHR)', departureTime: '2026-05-18T19:00:00Z', arrivalTime: '2026-05-19T07:00:00Z', totalSeats: 240, seatsAvailable: 60, price: 729.0 },
  { flightNumber: 'JL-5', origin: 'Los Angeles (LAX)', destination: 'Tokyo (HND)', departureTime: '2026-05-20T11:00:00Z', arrivalTime: '2026-05-21T15:30:00Z', totalSeats: 220, seatsAvailable: 75, price: 980.0 },
  { flightNumber: 'AC-880', origin: 'Toronto (YYZ)', destination: 'Vancouver (YVR)', departureTime: '2026-05-21T06:30:00Z', arrivalTime: '2026-05-21T08:55:00Z', totalSeats: 180, seatsAvailable: 130, price: 219.0 },
  { flightNumber: 'SW-302', origin: 'Dallas (DAL)', destination: 'Denver (DEN)', departureTime: '2026-05-22T10:45:00Z', arrivalTime: '2026-05-22T11:55:00Z', totalSeats: 150, seatsAvailable: 85, price: 159.0 },
  { flightNumber: 'EK-203', origin: 'New York (JFK)', destination: 'Dubai (DXB)', departureTime: '2026-05-23T22:15:00Z', arrivalTime: '2026-05-24T19:00:00Z', totalSeats: 280, seatsAvailable: 100, price: 1199.0 },
];

async function seed({ force = false } = {}) {
  const flightCount = await Flight.countDocuments();
  if (flightCount === 0 || force) {
    if (force) await Flight.deleteMany({});
    await Flight.insertMany(SAMPLE_FLIGHTS);
    console.log(`Seeded ${SAMPLE_FLIGHTS.length} sample flights`);
  }

  const adminExists = await User.findOne({ email: 'admin@airline.test' });
  if (!adminExists) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'admin',
      email: 'admin@airline.test',
      passwordHash,
      role: 'admin',
    });
    console.log('Created default admin: admin@airline.test / admin123');
  }

  const customerExists = await User.findOne({ email: 'demo@airline.test' });
  if (!customerExists) {
    const passwordHash = await bcrypt.hash('demo1234', 10);
    await User.create({
      username: 'demo',
      email: 'demo@airline.test',
      passwordHash,
      role: 'customer',
    });
    console.log('Created demo customer: demo@airline.test / demo1234');
  }
}

module.exports = seed;

if (require.main === module) {
  (async () => {
    const { connect, disconnect } = require('./config/db');
    await connect();
    await seed({ force: true });
    await disconnect();
    process.exit(0);
  })();
}
