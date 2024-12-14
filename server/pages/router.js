const express = require("express");
const { isAuth } = require("../auth/middlewares");
const router = express.Router();

// Страница профиля
router.get("/", isAuth, (req, res) => {
  const token = req.cookies.token || null;
  res.render("home", { pageTitle: "Начальная страница", token });
});

// Страница регистрации
router.get("/register", (req, res) => {
  res.render("register", { pageTitle: "Регистрация" });
});

// Страница авторизации
router.get("/login", (req, res) => {
  const error = req.cookies.error || null;
  res.clearCookie("error");
  res.render("login", { pageTitle: "Авторизация", error });
});

// Страница вопросов (List)
router.get("/questions", isAuth, (req, res) => {
  res.render("questions-list", { pageTitle: "Таблица Вопросов" });
});

// Страница вопроса (Object)
router.get("/question/:id", isAuth, (req, res) => {
  res.render("question-object", { id: req.params.id });
});

// Страница ответов (List)
router.get("/answers", isAuth, (req, res) => {
  res.render("answers-list", { pageTitle: "Таблица Ответов" });
});

// Страница ответа (Object)
router.get("/answer/:id", isAuth, (req, res) => {
  res.render("answer-object", { id: req.params.id });
});

// Страница профиля
router.get("/profile", isAuth, (req, res) => {
  res.render("profile");
});

module.exports = router;
