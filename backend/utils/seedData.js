require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Authority = require('../models/Authority');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/good-citizen', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({ email: { $in: ['admin@goodcitizen.com', 'john@example.com', 'jane@example.com'] } });
    await Authority.deleteMany({});

    console.log('Cleared existing seed data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@goodcitizen.com',
      phone: '9999999999',
      password: 'admin123',
      role: 'admin',
      isVerified: true,
      points: 0
    });

    console.log('✅ Admin user created:', admin.email);

    // Create sample users
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210',
        password: 'password123',
        isVerified: true,
        points: 150,
        reportsCount: 20,
        verifiedReportsCount: 15,
        reputation: 75
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '9876543211',
        password: 'password123',
        isVerified: true,
        points: 200,
        reportsCount: 25,
        verifiedReportsCount: 20,
        reputation: 80
      }
    ]);

    console.log(`✅ Created ${users.length} sample users`);

    // Create authorities
    const authorities = await Authority.create([
      {
        name: 'Traffic Police - Central Zone',
        email: 'traffic.central@authority.gov',
        contactNumber: '1800-111-222',
        department: 'Traffic Police',
        jurisdiction: 'Central Zone',
        categories: ['Helmet Violation', 'Traffic Violation', 'Illegal Parking']
      },
      {
        name: 'Municipal Corporation - North',
        email: 'municipal.north@authority.gov',
        contactNumber: '1800-333-444',
        department: 'Municipal Corporation',
        jurisdiction: 'North Zone',
        categories: ['Littering', 'Others']
      },
      {
        name: 'Environmental Protection Agency',
        email: 'env.protection@authority.gov',
        contactNumber: '1800-555-666',
        department: 'Environmental Agency',
        jurisdiction: 'City-wide',
        categories: ['Littering', 'Others']
      }
    ]);

    console.log(`✅ Created ${authorities.length} authorities`);

    console.log('\n🎉 Seed data created successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin - Email: admin@goodcitizen.com, Password: admin123');
    console.log('User 1 - Email: john@example.com, Password: password123');
    console.log('User 2 - Email: jane@example.com, Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
