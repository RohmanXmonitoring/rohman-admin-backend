const User = require('../models/User');
const Session = require('../models/Session');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { success, error } = require('../utils/response');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return error(res, 'Invalid credentials', 401);
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Save session for rotation tracking
    await Session.create({
      userId: user._id,
      refreshToken: refreshToken,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    return success(res, {
      token,
      refreshToken,
      user: { id: user._id, fullName: user.fullName, role: user.role }
    }, 'Login successful');
  } catch (err) {
    return error(res, err.message);
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return error(res, 'Refresh token required', 400);

    const session = await Session.findOne({ refreshToken, isValid: true });
    if (!session) return error(res, 'Invalid or expired session', 401);

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    const newToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return success(res, { token: newToken }, 'Token refreshed');
  } catch (err) {
    return error(res, 'Invalid refresh token', 401);
  }
};

exports.logout = (req, res) => {
  return success(res, null, 'Logged out successfully');
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return error(res, 'User not found', 404);
    return success(res, user);
  } catch (err) {
    return error(res, err.message);
  }
};
