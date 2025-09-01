// middleware/isAdmin.js
const isAdmin = (req, res, next) => {
  if (req.user && req.user.uloga === 'admin') {
    next();
  } else {
    res.status(403).json({ poruka: 'Pristup dozvoljen samo administratorima.' });
  }
};

module.exports = isAdmin;
