const express = require("express");
const router = express.Router();
const Manufacturer = require("../models/Manufacturer");
const Product = require("../models/Product");
const verifyToken = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

// Dodavanje proizvođača (samo admin)
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const novi = new Manufacturer({
      ime: req.body.ime,
      opis: req.body.opis,
      logo: req.body.logo,
    });
    await novi.save();
    res
      .status(201)
      .json({ poruka: "Proizvođač je uspješno dodat.", proizvodjac: novi });
  } catch (err) {
    res.status(500).json({ poruka: "Greška prilikom dodavanja proizvođača." });
  }
});

// Prikaz svih proizvođača (dostupan svima)
router.get("/", async (req, res) => {
  try {
    const proizvodjaci = await Manufacturer.find();
    res.json(proizvodjaci);
  } catch (err) {
    res
      .status(500)
      .json({ poruka: "Greška prilikom preuzimanja proizvođača." });
  }
});

// Prikaz po ID-u (dostupan svima)
router.get("/id/:id", async (req, res) => {
  try {
    const proizvodjac = await Manufacturer.findById(req.params.id);
    if (!proizvodjac) {
      return res.status(404).json({ poruka: "Proizvođač nije pronađen." });
    }
    res.json(proizvodjac);
  } catch (err) {
    res.status(500).json({ poruka: "Greška prilikom pretrage po ID-u." });
  }
});

// Prikaz po imenu (dostupan svima)
router.get("/ime/:ime", async (req, res) => {
  try {
    const proizvodjac = await Manufacturer.findOne({ ime: req.params.ime });
    if (!proizvodjac) {
      return res.status(404).json({ poruka: "Proizvođač nije pronađen." });
    }
    res.json(proizvodjac);
  } catch (err) {
    res.status(500).json({ poruka: "Greška prilikom pretrage po imenu." });
  }
});

// Ažuriranje po ID-u (samo admin)
router.put("/id/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const azuriran = await Manufacturer.findByIdAndUpdate(
      req.params.id,
      {
        ime: req.body.ime,
        opis: req.body.opis,
        logo: req.body.logo,
      },
      { new: true }
    );
    res.json({ poruka: "Proizvođač je ažuriran.", proizvodjac: azuriran });
  } catch (err) {
    res.status(500).json({ poruka: "Greška prilikom ažuriranja proizvođača." });
  }
});

// Ažuriranje po imenu (samo admin)
router.put("/ime/:ime", verifyToken, isAdmin, async (req, res) => {
  try {
    const azuriran = await Manufacturer.findOneAndUpdate(
      { ime: req.params.ime },
      {
        ime: req.body.ime,
        opis: req.body.opis,
        logo: req.body.logo,
      },
      { new: true }
    );
    if (!azuriran) {
      return res.status(404).json({ poruka: "Proizvođač nije pronađen." });
    }
    res.json({ poruka: "Proizvođač je ažuriran.", proizvodjac: azuriran });
  } catch (err) {
    res.status(500).json({ poruka: "Greška prilikom ažuriranja proizvođača." });
  }
});

// Brisanje po ID-u (samo admin)
router.delete("/id/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    // Provjera: da li postoji proizvod koji koristi ovog proizvođača
    const brojProizvoda = await Product.countDocuments({
      proizvodjac: req.params.id,
    });

    if (brojProizvoda > 0) {
      return res.status(400).json({
        poruka: `Ne možete obrisati ovog proizvođača jer ga koristi ${brojProizvoda} proizvod(a).`,
      });
    }

    await Manufacturer.findByIdAndDelete(req.params.id);
    res.json({ poruka: "Proizvođač je obrisan." });
  } catch (err) {
    res.status(500).json({ poruka: "Greška prilikom brisanja proizvođača." });
  }
});

// Brisanje po imenu (samo admin)
router.delete("/ime/:ime", verifyToken, isAdmin, async (req, res) => {
  try {
    const obrisan = await Manufacturer.findOneAndDelete({
      ime: req.params.ime,
    });
    if (!obrisan) {
      return res.status(404).json({ poruka: "Proizvođač nije pronađen." });
    }
    res.json({ poruka: "Proizvođač je obrisan." });
  } catch (err) {
    res.status(500).json({ poruka: "Greška prilikom brisanja proizvođača." });
  }
});

module.exports = router;
