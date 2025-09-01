const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const User = require("../models/User");

router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("grad", "ime") // ← ključno
      .select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ poruka: "Greška prilikom dohvatanja korisnika" });
  }
});

module.exports = router;
