const BaseModel = require('./BaseModel');

class Session extends BaseModel {
  constructor() {
    super('sessions');
  }
}

module.exports = new Session();
