const express = require('express');
const router = express.Router();
const Town = require('../models/Town');
const verifyToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Dodavanje grada (samo admin)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const town = new Town({ ime: req.body.ime });
    await town.save();
    res.status(201).json({ poruka: 'Grad je uspješno dodat.', town });
  } catch (err) {
    res.status(500).json({ poruka: 'Greška prilikom dodavanja grada.' });
  }
});

// Prikaz svih gradova (javno dostupno)
router.get('/', async (req, res) => {
  try {
    const towns = await Town.find();
    res.json(towns);
  } catch (err) {
    res.status(500).json({ poruka: 'Greška prilikom preuzimanja gradova.' });
  }
});

// Prikaz grada po imenu (javno dostupno)
router.get('/ime/:ime', async (req, res) => {
  try {
    const town = await Town.findOne({ ime: req.params.ime });
    if (!town) {
      return res.status(404).json({ poruka: 'Grad nije pronađen.' });
    }
    res.json(town);
  } catch (err) {
    res.status(500).json({ poruka: 'Greška prilikom pretrage grada po imenu.' });
  }
});

// Prikaz grada po ID-u (javno dostupno)
router.get('/id/:id', async (req, res) => {
  try {
    const town = await Town.findById(req.params.id);
    if (!town) {
      return res.status(404).json({ poruka: 'Grad nije pronađen.' });
    }
    res.json(town);
  } catch (err) {
    res.status(500).json({ poruka: 'Greška prilikom pretrage grada po ID-u.' });
  }
});

// Ažuriranje grada po imenu (samo admin)
router.put('/ime/:ime', verifyToken, isAdmin, async (req, res) => {
  try {
    const updated = await Town.findOneAndUpdate(
      { ime: req.params.ime },
      { ime: req.body.ime },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ poruka: 'Grad nije pronađen.' });
    }
    res.json({ poruka: 'Grad je ažuriran.', town: updated });
  } catch (err) {
    res.status(500).json({ poruka: 'Greška prilikom ažuriranja grada.' });
  }
});

// Ažuriranje grada po ID-u (samo admin)
router.put('/id/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const updated = await Town.findByIdAndUpdate(
      req.params.id,
      { ime: req.body.ime },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ poruka: 'Grad nije pronađen.' });
    }
    res.json({ poruka: 'Grad je ažuriran.', town: updated });
  } catch (err) {
    res.status(500).json({ poruka: 'Greška prilikom ažuriranja grada.' });
  }
});

// Brisanje grada po imenu (samo admin)
router.delete('/ime/:ime', verifyToken, isAdmin, async (req, res) => {
  try {
    const deleted = await Town.findOneAndDelete({ ime: req.params.ime });
    if (!deleted) {
      return res.status(404).json({ poruka: 'Grad nije pronađen.' });
    }
    res.json({ poruka: 'Grad je obrisan.' });
  } catch (err) {
    res.status(500).json({ poruka: 'Greška prilikom brisanja grada.' });
  }
});

// Brisanje grada po ID-u (samo admin)
router.delete('/id/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const deleted = await Town.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ poruka: 'Grad nije pronađen.' });
    }
    res.json({ poruka: 'Grad je obrisan.' });
  } catch (err) {
    res.status(500).json({ poruka: 'Greška prilikom brisanja grada.' });
  }
});

module.exports = router;
