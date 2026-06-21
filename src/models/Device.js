const BaseModel = require('./BaseModel');

class Device extends BaseModel {
  constructor() {
    super('devices');
  }
}

module.exports = new Device();
