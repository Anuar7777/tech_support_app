const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "my_secret_key";

const authenticateJWT = (req, res, next) => {
  const token = req.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Неверный или истекший токен." });
  }
};

module.exports = { authenticateJWT };
