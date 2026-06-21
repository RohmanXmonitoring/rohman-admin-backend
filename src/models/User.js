const BaseModel = require('./BaseModel');

class User extends BaseModel {
  constructor() {
    super('users');
  }

  // Helper method for specific query
  async findByUsername(username) {
    return this.findOne({ username: username.toLowerCase() });
  }

  async findByEmail(email) {
    return this.findOne({ email: email.toLowerCase() });
  }
}

module.exports = new User();
