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
  if (req.user.role !== "guest") {
    next();
  } else {
    res.status(403).render("error", {
      pageTitle: "Упс...",
      error: "Похоже, вы заблудились. Вернитесь на правильный путь!",
      status: 403,
      user: req.user,
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role == "admin") {
    next();
  } else {
    res.status(403).render("error", {
      pageTitle: "Упс...",
      error: "Похоже, вы заблудились. Вернитесь на правильный путь!",
      status: 403,
      user: req.user,
    });
  }
};

module.exports = { isAuth, isValidate, isAdmin };
