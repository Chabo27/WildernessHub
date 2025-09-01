const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Puna putanja do foldera public/uploads
const uploadPath = path.join(__dirname, '..', 'public', 'uploads');

// Kreiraj folder ako ne postoji
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Konfiguracija čuvanja fajlova
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  }
});

// Dozvoljene ekstenzije i ograničenje veličine
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExts.includes(ext)) {
      return cb(new Error('Dozvoljene ekstenzije: .jpg, .jpeg, .png, .webp'));
    }
    cb(null, true);
  }
});

module.exports = upload;
