const BaseModel = require('./BaseModel');

class AuditLog extends BaseModel {
  constructor() {
    super('audit_logs');
  }
}

module.exports = new AuditLog();
