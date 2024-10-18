const express = require("express");
const User = require("./user.model");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/admin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await User.findOne({ username });
    if (!admin) {
      res.status(404).send({ message: "Admin not found!" });
    }
    if (admin.password !== password) {
      res.status(401).send({ message: "Invalid Password!" });
    }
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Authentication Successful",
      token: token,
      user: {
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Failed to login as admin", error.message);
    res.status(401).send({ message: "Failed to login as admin" });
  }
});

module.exports = router;
