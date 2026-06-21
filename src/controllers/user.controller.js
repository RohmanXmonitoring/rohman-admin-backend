const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { success, error } = require('../utils/response');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return success(res, users);
  } catch (err) {
    return error(res, err.message);
  }
};

exports.createUser = async (req, res) => {
  try {
    const { fullName, username, email, password, role } = req.body;

    let user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return error(res, 'User with this username or email already exists', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    if (global.io) {
      global.io.to('admin_room').emit('user_updated', { action: 'CREATE', userId: user._id });
    }

    return success(res, { userId: user._id }, 'User created successfully', 201);
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

    // Hash password if it is being updated
    if (password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return error(res, 'User not found', 404);

    if (global.io) {
      global.io.to('admin_room').emit('user_updated', { action: 'UPDATE', userId: user._id });
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

    if (global.io) {
      global.io.to('admin_room').emit('user_updated', { action: 'DELETE', userId: req.params.id });
    }

    return success(res, null, 'User deleted successfully');
  } catch (err) {
    return error(res, err.message);
  }
};
