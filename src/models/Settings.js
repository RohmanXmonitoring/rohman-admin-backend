const BaseModel = require('./BaseModel');

class Settings extends BaseModel {
  constructor() {
    super('settings');
  }
}

module.exports = new Settings();
