const mongoose = require('mongoose');

const townSchema = new mongoose.Schema({
  ime: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Town', townSchema);


