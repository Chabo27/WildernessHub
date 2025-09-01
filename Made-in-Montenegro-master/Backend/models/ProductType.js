const mongoose = require('mongoose');

const productTypeSchema = new mongoose.Schema({
  ime: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('ProductType', productTypeSchema);
