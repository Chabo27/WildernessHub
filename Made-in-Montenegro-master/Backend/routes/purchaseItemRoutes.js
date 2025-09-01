const express = require("express");
const router = express.Router();
const PurchaseItem = require("../models/PurchaseItem");
const Purchase = require("../models/Purchase");
const verifyToken = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const Product = require("../models/Product");

// Dodavanje stavke kupovine (samo prijavljeni korisnici)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { kupovina, proizvod, kolicina, cijena } = req.body;

    // Provjera prava pristupa
    const kupovinaObj = await Purchase.findById(kupovina);
    if (!kupovinaObj) {
      return res.status(404).json({ poruka: "Kupovina nije pronađena." });
    }
    if (
      req.user.uloga !== "admin" &&
      kupovinaObj.korisnik.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ poruka: "Nemate pravo da dodate stavku za ovu kupovinu." });
    }

    // Provjera proizvoda
    const proizvodDoc = await Product.findById(proizvod);
    if (!proizvodDoc) {
      return res.status(404).json({ poruka: "Proizvod nije pronađen." });
    }

    if (proizvodDoc.kolicina < kolicina) {
      return res
        .status(400)
        .json({ poruka: "Nema dovoljno proizvoda na stanju." });
    }

    // Dodaj stavku
    const novaStavka = new PurchaseItem({
      kupovina,
      proizvod,
      kolicina,
      cijena,
    });
    await novaStavka.save();

    // Ažuriraj količinu proizvoda
    proizvodDoc.kolicina -= kolicina;
    await proizvodDoc.save();

    res
      .status(201)
      .json({ poruka: "Stavka kupovine je dodata.", stavka: novaStavka });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ poruka: "Greška prilikom dodavanja stavke kupovine." });
  }
});

// Prikaz svih stavki kupovine (samo admin)
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const stavke = await PurchaseItem.find()
      .populate("proizvod")
      .populate("kupovina");
    res.json(stavke);
  } catch (err) {
    res.status(500).json({ poruka: "Greška prilikom preuzimanja stavki." });
  }
});

// Prikaz stavke po ID-u (samo korisnik koji je vlasnik kupovine ili admin)
router.get("/id/:id", verifyToken, async (req, res) => {
  try {
    const stavka = await PurchaseItem.findById(req.params.id)
      .populate("proizvod")
      .populate("kupovina");
    if (!stavka)
      return res.status(404).json({ poruka: "Stavka nije pronađena." });

    if (
      req.user.uloga !== "admin" &&
      stavka.kupovina.korisnik.toString() !== req.user.id
    ) {
      return res.status(403).json({ poruka: "Nemate pristup ovoj stavci." });
    }

    res.json(stavka);
  } catch (err) {
    res.status(500).json({ poruka: "Greška prilikom pretrage stavke." });
  }
});

// Ažuriranje stavke (vlasnik kupovine ili admin)
router.put("/id/:id", verifyToken, async (req, res) => {
  try {
    const stavka = await PurchaseItem.findById(req.params.id).populate(
      "kupovina"
    );
    if (!stavka)
      return res.status(404).json({ poruka: "Stavka nije pronađena." });

    if (
      req.user.uloga !== "admin" &&
      stavka.kupovina.korisnik.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ poruka: "Nemate pravo da ažurirate ovu stavku." });
    }

    const azurirana = await PurchaseItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ poruka: "Stavka je ažurirana.", stavka: azurirana });
  } catch (err) {
    res.status(500).json({ poruka: "Greška prilikom ažuriranja stavke." });
  }
});

// Brisanje stavke (vlasnik kupovine ili admin)
router.delete("/id/:id", verifyToken, async (req, res) => {
  try {
    const stavka = await PurchaseItem.findById(req.params.id).populate(
      "kupovina"
    );
    if (!stavka)
      return res.status(404).json({ poruka: "Stavka nije pronađena." });

    if (
      req.user.uloga !== "admin" &&
      stavka.kupovina.korisnik.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ poruka: "Nemate pravo da obrišete ovu stavku." });
    }

    await PurchaseItem.findByIdAndDelete(req.params.id);
    res.json({ poruka: "Stavka je obrisana." });
  } catch (err) {
    res.status(500).json({ poruka: "Greška prilikom brisanja stavke." });
  }
});

module.exports = router;
