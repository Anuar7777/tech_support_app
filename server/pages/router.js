const express = require("express");
const { isAuth, isValidate } = require("../auth/middlewares");
const { User, Question, Answer } = require("./../../models");
const { Op, Sequelize } = require("sequelize");
const { raw } = require("body-parser");
const router = express.Router();

// Начальная страница
router.get("/", isAuth, async (req, res) => {
  const token = req.cookies.token || null;
  res.render("home", {
    pageTitle: "Начальная страница",
    token,
    user: req.user,
  });
});

// Страница регистрации
router.get("/register", (req, res) => {
  const error = req.cookies.error || null;
  res.clearCookie("error");
  res.render("login", { pageTitle: "Регистрация", error, newUser: true });
});

// Страница авторизации
router.get("/login", (req, res) => {
  const error = req.cookies.error || null;
  res.clearCookie("error");
  res.render("login", { pageTitle: "Авторизация", error, newUser: false });
});

// Страница вопросов (List)
router.get("/questions", isAuth, isValidate, async (req, res) => {
  try {
    const { search, sortBy, order } = req.query;

    const sortOptions = [
      [Sequelize.col(sortBy || "modified_at"), order || "DESC"],
    ];

    const search_value = search
      ? { question: { [Op.iLike]: `%${search}%` } }
      : {};
    const questions = await Question.findAll({
      where: search_value,
      attributes: { exclude: ["question_vector"] },
      include: [
        {
          model: Answer,
          as: "answer",
          attributes: ["answer"],
        },
        {
          model: User,
          as: "creator",
          attributes: ["email"],
        },
        {
          model: User,
          as: "modifier",
          attributes: ["email"],
        },
      ],
      order: sortOptions,
      raw: true,
      nest: true,
    });

    res.render("questions-list", {
      pageTitle: "Таблица Вопросов",
      questions,
      search,
      sortBy,
      order,
    });
  } catch (error) {
    console.error("Ошибка при загрузке ответа:", error);
    res.status(500).render("error", {
      error: "Ошибка сервера: " + error,
      pageTitle: "Упс...",
      status: 500,
    });
  }
});

// Страница вопроса (Object)
router.get("/question/:id", isAuth, isValidate, async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id, {
      attributes: { exclude: ["question_vector"] },
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["email"],
        },
        {
          model: User,
          as: "modifier",
          attributes: ["email"],
        },
      ],
      raw: true,
      nest: true,
    });

    if (!question) {
      return res.status(404).render("error", {
        pageTitle: "Упс...",
        error: "Страница не найдена",
        status: 404,
      });
    }

    const answers = await Answer.findAll({
      where: { answer_id: question.answer_id },
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["email"],
        },
        {
          model: User,
          as: "modifier",
          attributes: ["email"],
        },
      ],
      raw: true,
      nest: true,
    });
    res.render("question-object", {
      pageTitle: "Общая Информация",
      question,
      answers,
    });
  } catch (error) {
    console.error("Ошибка при загрузке вопроса: ", error);
    res
      .status(500)
      .render("error", { pageTitle: "Упс...", error: error, status: 500 });
  }
});

// Страница ответов (List)
router.get("/answers", isAuth, isValidate, async (req, res) => {
  try {
    const { search, sortBy, order } = req.query;

    const search_value = search
      ? { answer: { [Op.iLike]: `%${search}%` } }
      : {};

    const sortOptions = [
      [Sequelize.col(sortBy || "modified_at"), order || "DESC"],
    ];

    const answers = await Answer.findAll({
      where: search_value,
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["email"],
        },
        {
          model: User,
          as: "modifier",
          attributes: ["email"],
        },
      ],
      order: sortOptions,
      raw: true,
      nest: true,
    });

    res.render("answers-list", {
      pageTitle: "Таблица Ответов",
      answers,
      search,
      sortBy,
      order,
    });
  } catch (error) {
    console.error("Ошибка при загрузке ответа:", error);
    res.status(500).render("error", {
      error: "Ошибка сервера: " + error,
      pageTitle: "Упс...",
      status: 500,
    });
  }
});

// Страница ответа (Object)
router.get("/answer/:id", isAuth, isValidate, async (req, res) => {
  try {
    const answer = await Answer.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["email"],
        },
        {
          model: User,
          as: "modifier",
          attributes: ["email"],
        },
      ],
      raw: true,
      nest: true,
    });
    if (!answer) {
      return res.status(404).render("error", {
        pageTitle: "Упс...",
        error: "Страница не найдена",
        status: 404,
      });
    }

    const questions = await Question.findAll({
      where: { answer_id: req.params.id },
      attributes: { exclude: ["question_vector"] },
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["email"],
        },
        {
          model: User,
          as: "modifier",
          attributes: ["email"],
        },
      ],
      raw: true,
      nest: true,
    });
    res.render("answer-object", {
      pageTitle: "Общая Информация",
      answer,
      questions,
    });
  } catch (error) {
    console.error("Ошибка при загрузке ответа:", error);
    res
      .status(500)
      .render("error", { error: error, pageTitle: "Упс...", status: 500 });
  }
});

// Создание ответа
router.get("/new/answer", isAuth, isValidate, async (req, res) => {
  const error = req.cookies.error || null;
  res.clearCookie("error");
  res.render("work-form", {
    pageTitle: "Новый ответ",
    type: "answer",
    edit_mode: false,
    error,
  });
});

// Редактирование ответа
router.get("/edit/answer/:id", isAuth, isValidate, async (req, res) => {
  try {
    const answer = await Answer.findByPk(req.params.id, {
      raw: true,
      nest: true,
    });

    if (!answer) {
      return res.status(404).render("error", {
        pageTitle: "Упс...",
        error: "Страница не найдена",
        status: 404,
      });
    }

    const error = req.cookies.error || null;
    res.clearCookie("error");
    res.render("work-form", {
      pageTitle: "Редактирование ответа",
      type: "answer",
      edit_mode: true,
      error,
      answer,
    });
  } catch (error) {
    console.error("Ошибка при загрузке ответа:", error);
    res
      .status(500)
      .render("error", { error: error, pageTitle: "Упс...", status: 500 });
  }
});

// Создание вопроса
router.get("/new/question", isAuth, isValidate, async (req, res) => {
  const error = req.cookies.error || null;
  res.clearCookie("error");
  res.render("work-form", {
    pageTitle: "Новый Вопрос",
    type: "question",
    edit_mode: false,
    error,
  });
});

// Редактирование вопроса
router.get("/edit/question/:id", isAuth, isValidate, async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id, {
      attributes: { exclude: ["question_vector"] },
      raw: true,
      nest: true,
    });

    if (!question) {
      return res.status(404).render("error", {
        pageTitle: "Упс...",
        error: "Страница не найдена",
        status: 404,
      });
    }

    const error = req.cookies.error || null;
    res.clearCookie("error");

    console.log(question);

    res.render("work-form", {
      pageTitle: "Редактирование вопроса",
      type: "question",
      edit_mode: true,
      error,
      question,
    });
  } catch (error) {
    console.error("Ошибка при загрузке вопроса:", error);
    res
      .status(500)
      .render("error", { error: error, pageTitle: "Упс...", status: 500 });
  }
});

// Страница профиля
router.get("/profile", isAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      throw new Error("Пользователь не найден");
    }

    const updated_question_count = await Question.count({
      where: { modified_by: req.user.userId },
    });
    const updated_answer_count = await Answer.count({
      where: { modified_by: req.user.userId },
    });
    const created_question_count = await Question.count({
      where: { created_by: req.user.userId },
    });
    const created_answer_count = await Answer.count({
      where: { created_by: req.user.userId },
    });

    const error = req.cookies.error || null;
    const success = req.cookies.success || null;
    res.clearCookie("error");
    res.clearCookie("success");

    res.render("profile", {
      pageTitle: "Мой Профиль",
      user: user.dataValues,
      created_question_count,
      created_answer_count,
      updated_question_count,
      updated_answer_count,
      error,
      success,
    });
  } catch (error) {
    console.error("Ошибка при загрузке профиля:", error);
    res.status(500).render("error", {
      pageTitle: "Упс...",
      error: "Не удалось загрузить профиль. Пожалуйста, попробуйте позже.",
      status: 500,
    });
  }
});

router.use("*", (req, res) => {
  res.status(404).render("error", {
    pageTitle: "Упс...",
    error: "Страница не найдена",
    status: 404,
  });
});

module.exports = router;
