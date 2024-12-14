const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const { registration, signIn } = require("./controller");

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
      .isLength({ max: 30 })
      .withMessage("Слишком длинный пароль."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    await registration(req, res);
  }
);

router.post("/signIn", signIn);

module.exports = router;
