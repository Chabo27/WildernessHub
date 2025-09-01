const express = require("express");
const router = express.Router();
const Purchase = require("../models/Purchase");
const PurchaseItem = require("../models/PurchaseItem");
const verifyToken = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const Product = require('../models/Product');

// Dodavanje kupovine (samo prijavljeni korisnik)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { nacinPlacanja } = req.body;

    const novaKupovina = new Purchase({
      korisnik: req.user.id, // korisnik iz tokena
      nacinPlacanja,
    });

    await novaKupovina.save();
    res
      .status(201)
      .json({ poruka: "Kupovina uspješno kreirana.", kupovina: novaKupovina });
  } catch (err) {
    console.error(err);
    res.status(500).json({ poruka: "Greška prilikom kreiranja kupovine." });
  }
});

// Prikaz svih kupovina (samo admin)
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const kupovine = await Purchase.find().populate(
      "korisnik",
      "ime prezime email"
    );
    res.json(kupovine);
  } catch (err) {
    res.status(500).json({ poruka: "Greška prilikom dohvatanja kupovina." });
  }
});

// Prikaz svih kupovina prijavljenog korisnika
router.get("/myPurchases", verifyToken, async (req, res) => {
  try {
    const kupovine = await Purchase.find({ korisnik: req.user.id }).sort({
      datum: -1,
    });
    res.json(kupovine);
  } catch (err) {
    res
      .status(500)
      .json({ poruka: "Greška prilikom preuzimanja vaših kupovina." });
  }
});

// Prikaz jedne kupovine po ID-u (admin ili vlasnik)
router.get("/id/:id", verifyToken, async (req, res) => {
  try {
    const kupovina = await Purchase.findById(req.params.id).populate(
      "korisnik",
      "ime prezime email"
    );

    if (!kupovina) {
      return res.status(404).json({ poruka: "Kupovina nije pronađena." });
    }

    // Ako korisnik nije admin i nije vlasnik, zabrani pristup
    if (
      req.user.uloga !== "admin" &&
      kupovina.korisnik._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ poruka: "Nemate pristup ovoj kupovini." });
    }

    res.json(kupovina);
  } catch (err) {
    res.status(500).json({ poruka: "Greška prilikom pretrage kupovine." });
  }
});

// Prikaz stavki za konkretnu kupovinu (admin ili vlasnik kupovine)
router.get("/:id/stavke", verifyToken, async (req, res) => {
  try {
    const kupovina = await Purchase.findById(req.params.id);
    if (!kupovina) {
      return res.status(404).json({ poruka: "Kupovina nije pronađena." });
    }

    // Provjera pristupa
    if (
      req.user.uloga !== "admin" &&
      kupovina.korisnik.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ poruka: "Nemate pristup stavkama ove kupovine." });
    }

    const stavke = await PurchaseItem.find({
      kupovina: req.params.id,
    }).populate("proizvod");
    res.json(stavke);
  } catch (err) {
    res
      .status(500)
      .json({ poruka: "Greška prilikom preuzimanja stavki kupovine." });
  }
});

// Ažuriranje kupovine (samo admin)
router.put("/id/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const azurirana = await Purchase.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ poruka: "Kupovina je ažurirana.", kupovina: azurirana });
  } catch (err) {
    res.status(500).json({ poruka: "Greška prilikom ažuriranja kupovine." });
  }
});

router.delete('/id/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const kupovinaId = req.params.id;

    // 1. Nađi sve stavke za kupovinu
    const stavke = await PurchaseItem.find({ kupovina: kupovinaId });

    for (const stavka of stavke) {
      const proizvodId = stavka.proizvod?._id || stavka.proizvod;
      const proizvod = await Product.findById(proizvodId);

      if (proizvod) {
        proizvod.kolicina += stavka.kolicina;
        await proizvod.save();

        // Ispis u konzolu
        console.log(
          `Proizvod "${proizvod.ime}" (${proizvod._id}) ažuriran: dodato ${stavka.kolicina} kom, nova količina: ${proizvod.kolicina}`
        );
      } else {
        console.warn(
          `⚠️ Proizvod sa ID ${proizvodId} nije pronađen za stavku ${stavka._id}`
        );
      }
    }

    // 2. Obriši sve stavke povezane sa kupovinom
    await PurchaseItem.deleteMany({ kupovina: kupovinaId });
    console.log(`Stavke za kupovinu ${kupovinaId} su obrisane.`);

    // 3. Obriši samu kupovinu
    await Purchase.findByIdAndDelete(kupovinaId);
    console.log(`Kupovina ${kupovinaId} je uspješno obrisana.`);

    res.json({ poruka: 'Kupovina, stavke i zalihe su uspješno ažurirane.' });
  } catch (err) {
    console.error('Greška u brisanju kupovine:', err);
    res.status(500).json({ poruka: 'Greška prilikom brisanja kupovine.' });
  }
});


module.exports = router;
