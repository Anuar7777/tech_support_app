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

    const validOrder = ["ASC", "DESC"];
    const validSortBy = [
      "question",
      "answer",
      "modifier.email",
      "modified_at",
      "creator.email",
      "created_at",
    ];

    if (
      sortBy &&
      (!validOrder.includes(order) || !validSortBy.includes(sortBy))
    ) {
      return res.status(404).render("error", {
        error: "Что-то не так с параметрами сортировки. Попробуйте снова.",
        pageTitle: "Упс...",
        status: 404,
        user: req.user,
      });
    }

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
      user: req.user,
    });
  } catch (error) {
    console.error("Ошибка при загрузке ответа:", error);
    res.status(500).render("error", {
      error: "Ошибка сервера: " + error,
      pageTitle: "Упс...",
      status: 500,
      user: req.user,
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
        error: "Ой, тут пусто! Похоже, страница ушла в отпуск!",
        status: 404,
        user: req.user,
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
      user: req.user,
    });
  } catch (error) {
    console.error("Ошибка при загрузке вопроса: ", error);
    res.status(500).render("error", {
      pageTitle: "Упс...",
      error: error,
      status: 500,
      user: req.user,
    });
  }
});

// Страница ответов (List)
router.get("/answers", isAuth, isValidate, async (req, res) => {
  try {
    const { search, sortBy, order } = req.query;

    const validOrder = ["ASC", "DESC"];
    const validSortBy = [
      "answer",
      "modifier.email",
      "modified_at",
      "creator.email",
      "created_at",
    ];

    if (
      sortBy &&
      (!validOrder.includes(order) || !validSortBy.includes(sortBy))
    ) {
      return res.status(404).render("error", {
        error: "Что-то не так с параметрами сортировки. Попробуйте снова.",
        pageTitle: "Упс...",
        status: 404,
        user: req.user,
      });
    }

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

    const error = req.cookies.error || null;
    res.clearCookie("error");

    res.render("answers-list", {
      pageTitle: "Таблица Ответов",
      answers,
      search,
      sortBy,
      order,
      user: req.user,
      error,
    });
  } catch (error) {
    console.error("Ошибка при загрузке ответа:", error);
    res.status(500).render("error", {
      error: "Ошибка сервера: " + error,
      pageTitle: "Упс...",
      status: 500,
      user: req.user,
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
        error: "Ой, тут пусто! Похоже, страница ушла в отпуск!",
        status: 404,
        user: req.user,
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
      user: req.user,
    });
  } catch (error) {
    console.error("Ошибка при загрузке ответа:", error);
    res.status(500).render("error", {
      error: error,
      pageTitle: "Упс...",
      status: 500,
      user: req.user,
    });
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
    user: req.user,
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
        error: "Ой, тут пусто! Похоже, страница ушла в отпуск!",
        status: 404,
        user: req.user,
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
      user: req.user,
    });
  } catch (error) {
    console.error("Ошибка при загрузке ответа:", error);
    res.status(500).render("error", {
      error: error,
      pageTitle: "Упс...",
      status: 500,
      user: req.user,
    });
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
    user: req.user,
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
        error: "Ой, тут пусто! Похоже, страница ушла в отпуск!",
        status: 404,
        user: req.user,
      });
    }

    const error = req.cookies.error || null;
    res.clearCookie("error");

    res.render("work-form", {
      pageTitle: "Редактирование вопроса",
      type: "question",
      edit_mode: true,
      error,
      question,
      user: req.user,
    });
  } catch (error) {
    console.error("Ошибка при загрузке вопроса:", error);
    res.status(500).render("error", {
      error: error,
      pageTitle: "Упс...",
      status: 500,
      user: req.user,
    });
  }
});

// Страница пользователей (List)
router.get("/users", isAuth, isValidate, async (req, res) => {
  try {
    const { search, sortBy, order } = req.query;

    const validOrder = ["ASC", "DESC"];
    const validSortBy = [
      "email",
      "role",
      "created_question_count",
      "updated_question_count",
      "created_answer_count",
      "updated_answer_count",
    ];

    if (
      sortBy &&
      (!validOrder.includes(order) || !validSortBy.includes(sortBy))
    ) {
      return res.status(404).render("error", {
        error: "Что-то не так с параметрами сортировки. Попробуйте снова.",
        pageTitle: "Упс...",
        status: 404,
        user: req.user,
      });
    }

    const search_value = search ? { email: { [Op.iLike]: `%${search}%` } } : {};

    const initial_users = await User.findAll({
      where: search_value,
      attributes: { exclude: ["password_hash", "updatedAt", "createdAt"] },
      raw: true,
      nest: true,
    });

    const users = await Promise.all(
      initial_users.map(async (user) => {
        const [
          created_question_count,
          updated_question_count,
          created_answer_count,
          updated_answer_count,
        ] = await Promise.all([
          Question.count({ where: { created_by: user.user_id } }),
          Question.count({ where: { modified_by: user.user_id } }),
          Answer.count({ where: { created_by: user.user_id } }),
          Answer.count({ where: { modified_by: user.user_id } }),
        ]);

        return {
          ...user,
          created_question_count,
          updated_question_count,
          created_answer_count,
          updated_answer_count,
        };
      })
    );

    if (sortBy) {
      users.sort((a, b) => {
        if (order === "DESC") {
          return typeof a[sortBy] === "string"
            ? b[sortBy].localeCompare(a[sortBy])
            : b[sortBy] - a[sortBy];
        }
        return typeof a[sortBy] === "string"
          ? a[sortBy].localeCompare(b[sortBy])
          : a[sortBy] - b[sortBy];
      });
    }

    res.render("users-list", {
      pageTitle: "Таблица Пользователей",
      users,
      search,
      sortBy,
      order,
      user: req.user,
    });
  } catch (error) {
    console.error("Ошибка при загрузке ответа:", error);
    res.status(500).render("error", {
      error: "Ошибка сервера: " + error,
      pageTitle: "Упс...",
      status: 500,
      user: req.user,
    });
  }
});

// Страница профиля
router.get("/user/:id", isAuth, async (req, res) => {
  try {
    const currentUser = req.user;

    if (req.params.id != currentUser.user_id && currentUser.role !== "admin") {
      return res.status(403).render("error", {
        pageTitle: "Упс...",
        error: "Похоже, вы заблудились. Вернитесь на правильный путь!",
        status: 403,
        user: req.user,
      });
    }

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).render("error", {
        pageTitle: "Упс...",
        error: "Ой, тут пусто! Похоже, страница ушла в отпуск!",
        status: 404,
        user: req.user,
      });
    }

    const [
      updated_question_count,
      updated_answer_count,
      created_question_count,
      created_answer_count,
    ] = await Promise.all([
      Question.count({ where: { modified_by: user.user_id } }),
      Answer.count({ where: { modified_by: user.user_id } }),
      Question.count({ where: { created_by: user.user_id } }),
      Answer.count({ where: { created_by: user.user_id } }),
    ]);

    const error = req.cookies.error || null;
    const success = req.cookies.success || null;
    res.clearCookie("error");
    res.clearCookie("success");

    return res.render("user-object", {
      pageTitle: "Карточка Пользователя",
      user: user.dataValues,
      created_question_count,
      created_answer_count,
      updated_question_count,
      updated_answer_count,
      error,
      success,
      currentUser,
    });
  } catch (error) {
    console.error("Ошибка при загрузке профиля:", error);
    return res.status(500).render("error", {
      pageTitle: "Упс...",
      error: "Не удалось загрузить профиль. Пожалуйста, попробуйте позже.",
      status: 500,
      user: req.user,
    });
  }
});

router.use("*", isAuth, (req, res) => {
  res.status(404).render("error", {
    pageTitle: "Упс...",
    error: "Ой, тут пусто! Похоже, страница ушла в отпуск!",
    status: 404,
    user: req.user,
  });
});

module.exports = router;
