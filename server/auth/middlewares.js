const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "my_secret_key";

const isAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Ошибка проверки токена:", error.message);
    res.clearCookie("token");
    return res.redirect("/login");
  }
};

const isValidate = (req, res, next) => {
  if (req.user.isValidate) {
    next();
  } else {
    res.status(401).render("error", {
      pageTitle: "Упс...",
      error: "Доступ запрещен",
      status: 401,
    });
  }
};

module.exports = { isAuth, isValidate };
