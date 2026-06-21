const License = require('../models/License');

class LicenseService {
  async getLicenses() {
    return await License.find().populate('userId', 'fullName username email').sort({ createdAt: -1 });
  }

  async createLicense(data) {
    const license = new License(data);
    return await license.save();
  }

  async updateLicense(id, data) {
    return await License.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteLicense(id) {
    return await License.findByIdAndDelete(id);
  }
}

module.exports = new LicenseService();
