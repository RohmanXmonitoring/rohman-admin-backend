const BaseModel = require('./BaseModel');

class Permission extends BaseModel {
  constructor() {
    super('permissions');
  }
}

module.exports = new Permission();
