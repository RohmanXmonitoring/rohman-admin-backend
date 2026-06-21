const User = require('../models/User');
const bcrypt = require('bcryptjs');

class UserService {
  async getAllUsers() {
    return await User.find().select('-password').sort({ createdAt: -1 });
  }

  async createUser(userData) {
    const { email, username, password } = userData;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) throw new Error('User already exists');

    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(password, salt);

    const user = new User(userData);
    return await user.save();
  }

  async updateUser(id, updateData) {
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }
    return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }
}

module.exports = new UserService();
