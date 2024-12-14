const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("./../../models");

const JWT_SECRET = process.env.JWT_SECRET || "my_secret_key";

const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      res.cookie("error", "Пользователь с таким email уже существует.", {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
      });
      return res.redirect("/register");
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

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.redirect("/");
  } catch (error) {
    res.cookie("error", "Ошибка регистрации", {
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
    });
    console.log(error.message);
    res.redirect("/register");
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.cookie("error", "Неверный email или пароль", {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
      });
      return res.redirect("/login");
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.cookie("error", "Неверный email или пароль", {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
      });
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
    res.cookie("error", "Ошибка авторизации.", {
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
    });
    console.log(error.message);
    res.redirect("/login");
  }
};

const signOut = (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
};

module.exports = { signUp, signIn, signOut };
