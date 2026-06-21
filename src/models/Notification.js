const BaseModel = require('./BaseModel');

class Notification extends BaseModel {
  constructor() {
    super('notifications');
  }
}

module.exports = new Notification();
