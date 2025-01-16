const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const { isAuth } = require("./middlewares");
const { signUp, signIn, signOut } = require("./controller");
const { deleteUser, changePassword } = require("./profile");

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

router.delete("/deleteUser", isAuth, deleteUser);

router.post(
  "/changePassword",
  isAuth,
  [
    body("new_password_1")
      .isLength({ min: 8 })
      .withMessage("Пароль должен содержать минимум 8 символов")
      .isLength({ max: 30 })
      .withMessage("Пароль не должен превышать 30 символов")
      .not()
      .isEmpty()
      .withMessage("Поле осталось пустым"),
    body("new_password_2")
      .isLength({ min: 8 })
      .withMessage("Пароли не совпадают")
      .isLength({ max: 30 })
      .withMessage("Пароли не совпадают")
      .not()
      .isEmpty()
      .withMessage("Поле осталось пустым")
      .custom((value, { req }) => {
        if (value !== req.body.new_password_1) {
          throw new Error("Пароли не совпадают");
        }
        return true;
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const firstError = errors.array()[0].msg;
      res.cookie("error", firstError, {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
      });
      return res.redirect("/profile?error=true");
    }
    await changePassword(req, res);
  }
);

module.exports = router;
