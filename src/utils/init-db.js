const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const initDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for initialization');

    const adminExists = await User.findOne({ role: 'SUPER_ADMIN' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      const superAdmin = new User({
        fullName: 'Super Admin',
        username: 'admin',
        email: 'admin@rohman.com',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE'
      });

      await superAdmin.save();
      console.log('Super Admin created: admin / admin123');
    } else {
      console.log('Super Admin already exists');
    }

    process.exit(0);
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
};

initDB();
