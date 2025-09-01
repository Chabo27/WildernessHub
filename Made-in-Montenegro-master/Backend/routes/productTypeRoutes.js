const express = require("express");
const router = express.Router();
const ProductType = require("../models/ProductType");
const verifyToken = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const Product = require('../models/Product');

// Dodavanje tipa proizvoda (samo admin)
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const noviTip = new ProductType({ ime: req.body.ime });
    await noviTip.save();
    res
      .status(201)
      .json({ poruka: "Tip proizvoda je uspješno dodat.", tip: noviTip });
  } catch (err) {
    res
      .status(500)
      .json({ poruka: "Greška prilikom dodavanja tipa proizvoda." });
  }
});

// Prikaz svih tipova proizvoda (dostupno svima)
router.get("/", async (req, res) => {
  try {
    const tipovi = await ProductType.find();
    res.json(tipovi);
  } catch (err) {
    res
      .status(500)
      .json({ poruka: "Greška prilikom preuzimanja tipova proizvoda." });
  }
});

// Prikaz tipa proizvoda po imenu (dostupno svima)
router.get("/ime/:ime", async (req, res) => {
  try {
    const tip = await ProductType.findOne({ ime: req.params.ime });
    if (!tip) {
      return res.status(404).json({ poruka: "Tip proizvoda nije pronađen." });
    }
    res.json(tip);
  } catch (err) {
    res
      .status(500)
      .json({ poruka: "Greška prilikom pretrage tipa proizvoda." });
  }
});

// Prikaz tipa proizvoda po ID-u (dostupno svima)
router.get("/id/:id", async (req, res) => {
  try {
    const tip = await ProductType.findById(req.params.id);
    if (!tip) {
      return res.status(404).json({ poruka: "Tip proizvoda nije pronađen." });
    }
    res.json(tip);
  } catch (err) {
    res
      .status(500)
      .json({ poruka: "Greška prilikom pretrage tipa proizvoda po ID-u." });
  }
});

// Ažuriranje tipa proizvoda po ID-u (samo admin)
router.put("/id/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const azuriran = await ProductType.findByIdAndUpdate(
      req.params.id,
      { ime: req.body.ime },
      { new: true }
    );
    res.json({ poruka: "Tip proizvoda je ažuriran.", tip: azuriran });
  } catch (err) {
    res
      .status(500)
      .json({ poruka: "Greška prilikom ažuriranja tipa proizvoda." });
  }
});

// Ažuriranje tipa proizvoda po imenu (samo admin)
router.put("/ime/:ime", verifyToken, isAdmin, async (req, res) => {
  try {
    const azuriran = await ProductType.findOneAndUpdate(
      { ime: req.params.ime },
      { ime: req.body.ime },
      { new: true }
    );
    if (!azuriran) {
      return res.status(404).json({ poruka: "Tip proizvoda nije pronađen." });
    }
    res.json({ poruka: "Tip proizvoda je ažuriran.", tip: azuriran });
  } catch (err) {
    res
      .status(500)
      .json({ poruka: "Greška prilikom ažuriranja tipa proizvoda." });
  }
});

// Brisanje tipa proizvoda po ID-u (samo admin)
router.delete("/id/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    // Provjera: da li postoji proizvod koji koristi ovaj tip
    const brojProizvoda = await Product.countDocuments({ tip: req.params.id });

    if (brojProizvoda > 0) {
      return res.status(400).json({
        poruka: `Ne možete obrisati ovaj tip jer postoji ${brojProizvoda} proizvod(a) koji ga koristi.`,
      });
    }

    // Ako nema zavisnih proizvoda → dozvoli brisanje
    await ProductType.findByIdAndDelete(req.params.id);
    res.json({ poruka: "Tip je uspješno obrisan." });
  } catch (err) {
    res.status(500).json({ poruka: "Greška prilikom brisanja tipa." });
  }
});

// Brisanje tipa proizvoda po imenu (samo admin)
router.delete("/ime/:ime", verifyToken, isAdmin, async (req, res) => {
  try {
    const obrisan = await ProductType.findOneAndDelete({ ime: req.params.ime });
    if (!obrisan) {
      return res.status(404).json({ poruka: "Tip proizvoda nije pronađen." });
    }
    res.json({ poruka: "Tip proizvoda je obrisan." });
  } catch (err) {
    res
      .status(500)
      .json({ poruka: "Greška prilikom brisanja tipa proizvoda." });
  }
});

module.exports = router;
