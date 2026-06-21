const BaseModel = require('./BaseModel');

class EnrollmentPin extends BaseModel {
  constructor() {
    super('enrollment_pins');
  }
}

module.exports = new EnrollmentPin();
