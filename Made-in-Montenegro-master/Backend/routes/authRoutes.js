const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Registracija korisnika
router.post('/register', async (req, res) => {
  try {
    let { ime, prezime, email, password, adresa, grad } = req.body;

    // Normalizuj email: ukloni razmake, pretvori u mala slova
    email = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ poruka: 'Korisnik sa datim emailom već postoji.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      ime,
      prezime,
      email,
      password: hashedPassword,
      adresa,
      grad
    });

    await newUser.save();
    res.status(201).json({ poruka: 'Korisnik je uspješno registrovan.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ poruka: 'Greška na serveru prilikom registracije.' });
  }
});
// Prijava korisnika (login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ poruka: 'Ne postoji korisnik sa datim emailom.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ poruka: 'Pogrešna lozinka.' });
    }

    const token = jwt.sign(
      { id: user._id, uloga: user.uloga , email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      poruka: 'Prijava uspješna.',
      token,
      korisnik: {
        id: user._id,
        ime: user.ime,
        prezime: user.prezime,
        email: user.email,
        uloga: user.uloga,
        grad: user.grad
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ poruka: 'Greška na serveru prilikom prijave.' });
  }
});

// Prikaz svih korisnika
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().populate('grad', 'ime'); // Prikazuje i ime grada
    res.json(users);
  } catch (err) {
    res.status(500).json({ poruka: 'Greška prilikom preuzimanja korisnika.' });
  }
});

// Prikaz korisnika po emailu (dozvoljeno samo ako je to korisnik ili admin)
router.get('/user/email/:email', verifyToken, async (req, res) => {
  try {
    const email = req.params.email;

    // Ako nije admin, može vidjeti samo svoje podatke
    if (req.user.uloga !== 'admin' && req.user.email !== email) {
      return res.status(403).json({ poruka: 'Nemate pristup ovom korisniku.' });
    }

    const user = await User.findOne({ email }).populate('grad', 'ime');
    if (!user) {
      return res.status(404).json({ poruka: 'Korisnik nije pronađen.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ poruka: 'Greška prilikom pretrage korisnika po emailu.' });
  }
});

// Prikaz jednog korisnika po ID-u (dozvoljeno ako je to korisnik ili admin)
router.get('/user/id/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('grad', 'ime');
    if (!user) {
      return res.status(404).json({ poruka: 'Korisnik nije pronađen.' });
    }

    // Ako nije admin, može vidjeti samo svoje podatke
    if (req.user.uloga !== 'admin' && req.user.id !== user._id.toString()) {
      return res.status(403).json({ poruka: 'Nemate pristup ovom korisniku.' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ poruka: 'Greška prilikom pretrage korisnika po ID-u.' });
  }
});



module.exports = router;
