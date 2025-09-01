const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  korisnik: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  datum: {
    type: Date,
    default: Date.now
  },
  nacinPlacanja: {
    type: String,
    enum: ['kartica', 'pouzećem'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);
