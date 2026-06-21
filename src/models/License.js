const BaseModel = require('./BaseModel');

class License extends BaseModel {
  constructor() {
    super('licenses');
  }
}

module.exports = new License();
