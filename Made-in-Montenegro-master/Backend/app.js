// app.js
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Konekcija s MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Uspješno povezano sa MongoDB bazom podataka"))
.catch((err) => console.error("Greška pri povezivanju s bazom podataka:", err));

// Import ruta
const authRoutes = require('./routes/authRoutes'); // /api/auth
const townRoutes = require('./routes/townRoutes');
const productTypeRoutes = require('./routes/productTypeRoutes');
const manufacturerRoutes = require('./routes/manufacturerRoutes');
const productRoutes = require('./routes/productRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const purchaseItemRoutes = require('./routes/purchaseItemRoutes');
const userRoutes=require('./routes/usersRoutes');


// Korišćenje ruta
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/towns', townRoutes);
app.use('/api/types', productTypeRoutes);
app.use('/api/manufacturers', manufacturerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/purchase-items', purchaseItemRoutes);
app.use('/uploads', express.static('public/uploads'));
app.use('/api/users', userRoutes);


// Test ruta
app.get('/', (req, res) => {
  res.send('Made in Montenegro API radi!');
});

// Pokretanje servera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server pokrenut na portu ${PORT}`);
});
