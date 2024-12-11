const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const { registration, login } = require("./controller");


router.post(
  "/registration",
  [
    body("email")
      .isEmail()
      .withMessage("Введите корректный email.")
      .notEmpty()
      .withMessage("Email не может быть пустым."),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Пароль должен содержать минимум 8 символов.")
      .matches(/[A-Z]/)
      .withMessage("Пароль должен содержать хотя бы одну заглавную букву.")
      .matches(/[a-z]/)
      .withMessage("Пароль должен содержать хотя бы одну строчную букву.")
      .matches(/[0-9]/)
      .withMessage("Пароль должен содержать хотя бы одну цифру."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    await registration(req, res);
  }
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Введите корректный email.")
      .notEmpty()
      .withMessage("Email не может быть пустым."),
    body("password").notEmpty().withMessage("Пароль не может быть пустым."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    await login(req, res);
  }
);

module.exports = router;
