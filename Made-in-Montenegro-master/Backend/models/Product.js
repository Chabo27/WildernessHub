const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    ime: {
      type: String,
      required: true,
      trim: true,
    },
    opis: {
      type: String,
    },
    cijena: {
      type: Number,
      required: true,
      min: 0.01,
    },
    slika: {
      type: String,
    },
    tip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductType",
      required: true,
    },
    proizvodjac: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manufacturer",
      required: true,
    },
    kolicina: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
