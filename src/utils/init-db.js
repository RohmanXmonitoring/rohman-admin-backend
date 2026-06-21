const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { admin } = require('../config/firebase');
require('dotenv').config();

const initDB = async () => {
  try {
    console.log('Initializing Firebase/Firestore...');

    if (!admin.apps.length) {
      console.error('Firebase Admin not initialized. Check your environment variables.');
      process.exit(1);
    }

    const adminExists = await User.findOne({ role: 'SUPER_ADMIN' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      await User.create({
        fullName: 'Super Admin',
        username: 'admin',
        email: 'admin@rohman.com',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE'
      });
      console.log('Super Admin created: admin / admin123');
    } else {
      console.log('Super Admin already exists');
    }

    console.log('Initialization complete.');
    process.exit(0);
  } catch (error) {
    console.error('Initialization error:', error);
    process.exit(1);
  }
};

// Wait a bit for firebase to initialize
setTimeout(initDB, 2000);
