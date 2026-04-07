const bcrypt = require('bcrypt');
const db = require('./database');

const VEHICLES = [
  {
    name: 'Class B Camper Van',
    type: 'campervan',
    make: 'Winnebago',
    model: 'Travato',
    year: 2023,
    capacity: 2,
    sleeping_capacity: 2,
    price_per_day: 120,
    description: 'Compact and nimble camper van perfect for couples or solo travelers exploring scenic routes.',
    features: JSON.stringify(['Kitchen', 'Solar Panel', 'Bluetooth Audio', 'USB Charging', 'Popup Roof Bed']),
    image_url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&auto=format&fit=crop',
  },
  {
    name: 'Class C Motorhome',
    type: 'motorhome',
    make: 'Thor Motor Coach',
    model: 'Axis',
    year: 2022,
    capacity: 4,
    sleeping_capacity: 4,
    price_per_day: 200,
    description: 'Mid-size motorhome ideal for small families or friend groups on road trips with full amenities.',
    features: JSON.stringify(['Full Kitchen', 'Bathroom', 'AC', 'Generator', 'Awning', 'TV']),
    image_url: 'https://images.unsplash.com/photo-1631646109206-4b1cb15b2c5c?w=800&auto=format&fit=crop',
  },
  {
    name: 'Compact Family RV',
    type: 'motorhome',
    make: 'Forest River',
    model: 'Sunseeker',
    year: 2023,
    capacity: 5,
    sleeping_capacity: 5,
    price_per_day: 250,
    description: 'Spacious yet easy-to-drive RV designed for family road trips with comfortable sleeping for five.',
    features: JSON.stringify(['Full Kitchen', 'Bathroom', 'AC', 'Bunk Beds', 'Slide-Out', 'WiFi']),
    image_url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop',
  },
  {
    name: 'Family RV',
    type: 'motorhome',
    make: 'Coachmen',
    model: 'Leprechaun',
    year: 2022,
    capacity: 6,
    sleeping_capacity: 6,
    price_per_day: 300,
    description: 'Full-size family RV with multiple sleeping areas, a well-equipped kitchen, and room to stretch out.',
    features: JSON.stringify(['Full Kitchen', 'Bathroom', 'AC', 'Bunk Beds', 'Dual Slide-Out', 'Generator', 'TV']),
    image_url: 'https://images.unsplash.com/photo-1563299796-17596ed6b017?w=800&auto=format&fit=crop',
  },
  {
    name: 'Off-Grid Adventure RV',
    type: 'offroad',
    make: 'EarthRoamer',
    model: 'XV-HD',
    year: 2023,
    capacity: 4,
    sleeping_capacity: 4,
    price_per_day: 280,
    description: 'Rugged 4WD RV built for off-grid camping — mountains, deserts, and remote trails.',
    features: JSON.stringify(['4WD', 'Solar Panels', 'Water Tank', 'Off-road Tires', 'Composting Toilet', 'Roof Rack']),
    image_url: 'https://images.unsplash.com/photo-1473947050289-7de4ea62a656?w=800&auto=format&fit=crop',
  },
  {
    name: 'Luxury RV',
    type: 'luxury',
    make: 'Newmar',
    model: 'King Aire',
    year: 2024,
    capacity: 6,
    sleeping_capacity: 6,
    price_per_day: 450,
    description: 'Premium Class A motorhome with hotel-like interiors, perfect for a high-comfort road trip experience.',
    features: JSON.stringify(['King Bed', 'Full Bath', 'Gourmet Kitchen', 'Washer/Dryer', 'Smart TV', 'Surround Sound', 'Heated Floors']),
    image_url: 'https://images.unsplash.com/photo-1626436819530-fb081c8fe3aa?w=800&auto=format&fit=crop',
  },
  {
    name: 'Toy Hauler RV',
    type: 'toyhauler',
    make: 'Keystone',
    model: 'Carbon',
    year: 2022,
    capacity: 6,
    sleeping_capacity: 4,
    price_per_day: 350,
    description: 'Spacious RV with a rear garage for ATVs, bikes, or gear — great for adventure sports trips.',
    features: JSON.stringify(['Rear Garage', 'Full Kitchen', 'Bathroom', 'AC', 'Generator', 'Fold-Down Ramp']),
    image_url: 'https://images.unsplash.com/photo-1601924351433-5ef4b4e01898?w=800&auto=format&fit=crop',
  },
  {
    name: 'Mega Class A Motorhome',
    type: 'motorhome',
    make: 'Tiffin',
    model: 'Allegro Bus',
    year: 2024,
    capacity: 8,
    sleeping_capacity: 8,
    price_per_day: 500,
    description: 'Top-of-the-line Class A diesel pusher with maximum space for large groups and extended trips.',
    features: JSON.stringify(['Multiple Slide-Outs', 'King Bed', 'Full Bath', 'Satellite TV', 'Generator', 'Outdoor Kitchen', 'WiFi']),
    image_url: 'https://images.unsplash.com/photo-1543465077-db45d34b88a5?w=800&auto=format&fit=crop',
  },
];

async function seed() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  const vehicleCount = db.prepare('SELECT COUNT(*) as count FROM vehicles').get();

  if (userCount.count === 0) {
    const hash = await bcrypt.hash('Soumya@123', 10);
    db.prepare(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)'
    ).run('Soumya Reddy', 'soumyareddy9989+1@gmail.com', hash);
    console.log('Seeded default test user.');
  }

  if (vehicleCount.count === 0) {
    const insert = db.prepare(
      `INSERT INTO vehicles
       (name, type, make, model, year, capacity, sleeping_capacity, price_per_day, description, features, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const insertMany = db.transaction((vehicles) => {
      for (const v of vehicles) {
        insert.run(v.name, v.type, v.make, v.model, v.year, v.capacity, v.sleeping_capacity, v.price_per_day, v.description, v.features, v.image_url);
      }
    });
    insertMany(VEHICLES);
    console.log(`Seeded ${VEHICLES.length} RVs.`);
  }
}

module.exports = { seed };
