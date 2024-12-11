const express = require("express");
const { authenticateJWT } = require("../auth/middlewares");
const router = express.Router();

// Страница профиля
router.get("/", authenticateJWT, (req, res) => {
  res.render("home", { pageTitle: "Начальная страница" });
});

// Страница регистрации
router.get("/register", (req, res) => {
  res.render("register", { pageTitle: "Регистрация" });
});

// Страница авторизации
router.get("/login", (req, res) => {
  res.render("login", { pageTitle: "Авторизация" });
});

// Страница вопросов (List)
router.get("/questions", authenticateJWT, (req, res) => {
  res.render("questions-list", { pageTitle: "Таблица Вопросов" });
});

// Страница вопроса (Object)
router.get("/question/:id", authenticateJWT, (req, res) => {
  res.render("question-object", { id: req.params.id });
});

// Страница ответов (List)
router.get("/answers", authenticateJWT, (req, res) => {
  res.render("answers-list", { pageTitle: "Таблица Ответов" });
});

// Страница ответа (Object)
router.get("/answer/:id", authenticateJWT, (req, res) => {
  res.render("answer-object", { id: req.params.id });
});

// Страница профиля
router.get("/profile", authenticateJWT, (req, res) => {
  res.render("profile");
});

module.exports = router;
