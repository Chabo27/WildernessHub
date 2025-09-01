const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const verifyToken = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const upload = require("../middleware/upload");
const fs = require("fs");
const path = require("path");
// Dodavanje proizvoda (samo admin)
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("slika"),
  async (req, res) => {
    try {
      console.log("REQ.BODY:", req.body);
      console.log("REQ.FILE:", req.file);
      const slikaPath = req.file
        ? "/uploads/" + req.file.filename
        : req.body.slika || "";

      const noviProizvod = new Product({
        ime: req.body.ime,
        cijena: req.body.cijena,
        opis: req.body.opis,
        slika: slikaPath,
        proizvodjac: req.body.proizvodjac,
        tip: req.body.tip,
        kolicina: Number(req.body.kolicina),
      });

      await noviProizvod.save();
      res.status(201).json({
        poruka: "Proizvod je uspješno dodat.",
        proizvod: noviProizvod,
      });
    } catch (err) {
      console.error("Greška:", err);
      res.status(500).json({
        poruka: "Greška prilikom dodavanja proizvoda.",
        greska: err.message,
      });
    }
  }
);

// Prikaz svih proizvoda (dostupno svima)
router.get("/", async (req, res) => {
  try {
    const proizvodi = await Product.find().populate("proizvodjac tip");
    res.json(proizvodi);
  } catch (err) {
    res.status(500).json({ poruka: "Greška prilikom preuzimanja proizvoda." });
  }
});

// Prikaz proizvoda po ID-u (dostupno svima)
router.get("/id/:id", async (req, res) => {
  try {
    const proizvod = await Product.findById(req.params.id).populate(
      "proizvodjac tip"
    );
    if (!proizvod)
      return res.status(404).json({ poruka: "Proizvod nije pronađen." });
    res.json(proizvod);
  } catch (err) {
    res.status(500).json({ poruka: "Greška prilikom pretrage po ID-u." });
  }
});

// Prikaz proizvoda po imenu (dostupno svima)
router.get("/ime/:ime", async (req, res) => {
  try {
    const proizvod = await Product.findOne({ ime: req.params.ime }).populate(
      "proizvodjac tip"
    );
    if (!proizvod)
      return res.status(404).json({ poruka: "Proizvod nije pronađen." });
    res.json(proizvod);
  } catch (err) {
    res.status(500).json({ poruka: "Greška prilikom pretrage po imenu." });
  }
});

// Ažuriranje proizvoda po ID-u (samo admin)
router.put(
  "/id/:id",
  verifyToken,
  isAdmin,
  upload.single("slika"),
  async (req, res) => {
    try {
      const id = req.params.id;
      const proizvod = await Product.findById(id);
      if (!proizvod) {
        return res.status(404).json({ poruka: "Proizvod nije pronađen." });
      }

      // Ako je stigla nova slika
      let novaSlika = proizvod.slika;
      if (req.file) {
        // Obriši staru sliku ako postoji
        if (proizvod.slika && proizvod.slika.startsWith("/uploads/")) {
          const staraPutanja = path.join(
            __dirname,
            "..",
            "public",
            proizvod.slika
          );
          if (fs.existsSync(staraPutanja)) {
            fs.unlinkSync(staraPutanja);
          }
        }
        novaSlika = "/uploads/" + req.file.filename;
      }

      const azuriran = await Product.findByIdAndUpdate(
        id,
        {
          ime: req.body.ime,
          cijena: Number(req.body.cijena),
          opis: req.body.opis,
          kolicina: Number(req.body.kolicina),
          proizvodjac: req.body.proizvodjac,
          tip: req.body.tip,
          slika: novaSlika,
        },
        { new: true }
      );

      res.json({ poruka: "Proizvod je ažuriran.", proizvod: azuriran });
    } catch (err) {
      console.error("Greška pri ažuriranju proizvoda:", err);
      res.status(500).json({ poruka: "Greška prilikom ažuriranja proizvoda." });
    }
  }
);

// Ažuriranje proizvoda po imenu (samo admin)
router.put("/ime/:ime", verifyToken, isAdmin, async (req, res) => {
  try {
    const azuriran = await Product.findOneAndUpdate(
      { ime: req.params.ime },
      {
        ime: req.body.ime,
        cijena: req.body.cijena,
        opis: req.body.opis,
        slika: req.body.slika,
        proizvodjac: req.body.proizvodjac,
        tip: req.body.tip,
      },
      { new: true }
    );
    if (!azuriran)
      return res.status(404).json({ poruka: "Proizvod nije pronađen." });
    res.json({ poruka: "Proizvod je ažuriran.", proizvod: azuriran });
  } catch (err) {
    res.status(500).json({ poruka: "Greška prilikom ažuriranja proizvoda." });
  }
});

// Brisanje proizvoda po ID-u (samo admin)
router.delete("/id/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ poruka: "Proizvod je obrisan." });
  } catch (err) {
    res.status(500).json({ poruka: "Greška prilikom brisanja proizvoda." });
  }
});

// Brisanje proizvoda po imenu (samo admin)
router.delete("/ime/:ime", verifyToken, isAdmin, async (req, res) => {
  try {
    const obrisan = await Product.findOneAndDelete({ ime: req.params.ime });
    if (!obrisan)
      return res.status(404).json({ poruka: "Proizvod nije pronađen." });
    res.json({ poruka: "Proizvod je obrisan." });
  } catch (err) {
    res.status(500).json({ poruka: "Greška prilikom brisanja proizvoda." });
  }
});

router.post("/upload", upload.single("slika"), (req, res) => {
  if (!req.file) return res.status(400).json({ poruka: "Nema fajla" });

  res.json({
    poruka: "Uspješno uploadovana slika",
    path: `/uploads/${req.file.filename}`,
  });
});

// Prikaz svih proizvoda određenog proizvođača
router.get("/by-manufacturer/:id", async (req, res) => {
  try {
    const proizvodi = await Product.find({ proizvodjac: req.params.id });
    res.json(proizvodi);
  } catch (err) {
    res
      .status(500)
      .json({ poruka: "Greška prilikom dohvatanja proizvoda po proizvođaču." });
  }
});

module.exports = router;
