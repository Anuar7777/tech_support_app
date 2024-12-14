const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const { signUp, signIn, signOut } = require("./controller");

router.post(
  "/signUp",
  [
    body("email")
      .isEmail()
      .withMessage("Введите корректный email")
      .notEmpty()
      .withMessage("Email не может быть пустым"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Пароль должен содержать минимум 8 символов")
      .isLength({ max: 30 })
      .withMessage("Слишком длинный пароль"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const firstError = errors.array()[0].msg;
      res.cookie("error", firstError, {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
      });
      return res.redirect("/register");
    }
    await signUp(req, res);
  }
);

router.post("/signIn", signIn);

router.get("/signOut", signOut);

module.exports = router;
