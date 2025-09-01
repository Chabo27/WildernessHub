const mongoose = require('mongoose');

const purchaseItemSchema = new mongoose.Schema({
  proizvod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  kolicina: {
    type: Number,
    required: true,
    min: 1
  },
  kupovina: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Purchase',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('PurchaseItem', purchaseItemSchema);
