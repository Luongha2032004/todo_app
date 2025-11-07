const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ msg: "No token, authorization denied" });
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Invalid token format" });

  try {
    const secret = process.env.JWT_SECRET || "mysecretkey";
    const decoded = jwt.verify(token, secret);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
