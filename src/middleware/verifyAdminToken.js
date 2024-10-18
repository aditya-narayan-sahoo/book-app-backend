const jwt = require("jsonwebtoken");
const verifyAdminToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided!!" });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid credentials" });
    }
    req.user = user;
    next();
  });
};
module.exports = verifyAdminToken;
