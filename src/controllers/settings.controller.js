const Settings = require('../models/Settings');

exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.find();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateSetting = async (req, res) => {
  try {
    const { key, value } = req.body;
    const setting = await Settings.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }
    );
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
