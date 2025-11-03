import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/user.js';

dotenv.config();

async function seedAdmin() {
  await connectDB();
  const existing = await User.findOne({ role: 'admin' });
  if (existing) {
    console.log('Admin user already exists:', existing.email);
    process.exit(0);
  }
  const admin = new User({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@bootcamp.com',
    password: 'Admin@123',
    role: 'admin',
  });
  await admin.save();
  console.log('Default admin created:', admin.email, 'with password Admin@123');
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});