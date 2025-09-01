const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  ime: { type: String, required: true },
  prezime: { type: String, required: true },
  email: { type: String, required: true, unique: true },   //koristi se ya prijavu
  password: { type: String, required: true },
  adresa: { type: String },
  uloga: { type: String, enum: ['user', 'admin'], default: 'user' },
  grad: { type: mongoose.Schema.Types.ObjectId, ref: 'Town', required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
