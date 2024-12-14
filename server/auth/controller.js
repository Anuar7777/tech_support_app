const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("./../../models");

const JWT_SECRET = process.env.JWT_SECRET || "my_secret_key";

const registration = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Пользователь с таким email уже существует." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password_hash: hashedPassword,
    });

    const token = jwt.sign(
      { userId: newUser.user_id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .status(201)
      .json({ message: "Пользователь успешно зарегистрирован.", token });
  } catch (error) {
    res.status(500).json({
      message: "Ошибка регистрации пользователя.",
      error: error.message,
    });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      req.session.error = "Неверный email или пароль.";
      return res.redirect("/login");
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      req.session.error = "Неверный email или пароль.";
      return res.redirect("/login");
    }

    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.redirect("/");
  } catch (error) {
    req.session.error = "Ошибка авторизации.";
    res.redirect("/login");
  }
};

module.exports = { registration, signIn };
