const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { success, error } = require('../utils/response');
const { redisClient } = require('../config/redis');

exports.getUsers = async (req, res) => {
  try {
    const cacheKey = 'users_list';
    if (redisClient.isOpen) {
      const cached = await redisClient.get(cacheKey);
      if (cached) return success(res, JSON.parse(cached));
    }

    const users = await User.find().select('-password').sort({ createdAt: -1 });

    if (redisClient.isOpen) {
      await redisClient.setEx(cacheKey, 60, JSON.stringify(users)); // Cache for 1 minute
    }

    return success(res, users);
  } catch (err) {
    return error(res, err.message);
  }
};

exports.createUser = async (req, res) => {
  try {
    const { fullName, username, email, password, role } = req.body;

    let user = await User.findOne({ username: username.toLowerCase() });
    if (user) return error(res, 'Username already exists', 400);

    user = await User.findOne({ email: email.toLowerCase() });
    if (user) return error(res, 'Email already exists', 400);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'RESELLER',
      status: 'ACTIVE',
      licenseType: 'None',
      licenseExpired: 0
    });

    if (redisClient.isOpen) await redisClient.del('users_list');

    if (global.io) {
      global.io.to('admin_room').emit('user_updated', { action: 'CREATE', userId: newUser.id });
    }

    return success(res, { userId: newUser.id }, 'User created successfully', 201);
  } catch (err) {
    return error(res, err.message);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return error(res, 'User not found', 404);
    return success(res, user);
  } catch (err) {
    return error(res, err.message);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { password } = req.body;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body);
    if (!user) return error(res, 'User not found', 404);

    if (redisClient.isOpen) {
      await redisClient.del('users_list');
      await redisClient.del('dashboard_stats');
    }

    if (global.io) {
      global.io.to('admin_room').emit('user_updated', { action: 'UPDATE', userId: user.id });
    }

    return success(res, user, 'User updated successfully');
  } catch (err) {
    return error(res, err.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return error(res, 'User not found', 404);

    if (redisClient.isOpen) {
      await redisClient.del('users_list');
      await redisClient.del('dashboard_stats');
    }

    if (global.io) {
      global.io.to('admin_room').emit('user_updated', { action: 'DELETE', userId: req.params.id });
    }

    return success(res, null, 'User deleted successfully');
  } catch (err) {
    return error(res, err.message);
  }
};
