const mongoose = require('mongoose');

const manufacturerSchema = new mongoose.Schema({
  ime: { type: String, required: true, unique: true },
  opis: { type: String },
  logo: { type: String } // putanja ili URL do slike logotipa
});

module.exports = mongoose.model('Manufacturer', manufacturerSchema);
