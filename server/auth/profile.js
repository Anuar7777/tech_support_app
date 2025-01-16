const bcrypt = require("bcrypt");
const { User } = require("./../../models");

const changePassword = async (req, res) => {
  try {
    console.log("Команда сработала");
    const { new_password_2 } = req.body;
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      throw new Error("Пользователь не найден");
    }

    const hashedPassword = await bcrypt.hash(new_password_2, 10);
    console.log(hashedPassword);
    await User.update(
      { password_hash: hashedPassword },
      { where: { user_id: req.user.userId } }
    );

    res.cookie("success", "Пароль успешно изменен", {
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
    });
    res.redirect("/profile");
  } catch (error) {
    res.cookie("error", "Ошибка о стороны сервера", {
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
    });
    console.log(error.message);
    res.redirect("/profile?error=true");
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    await user.destroy();
    console.log(`Пользователь с ID ${req.user.userId} удалён`);
    res.clearCookie("token");

    res.status(200).json({ message: "Пользователь успешно удалён" });
  } catch (err) {
    console.error("Ошибка при удалении пользователя:", err);
    res.status(500).json({ error: "Ошибка сервера при удалении пользователя" });
  }
};

module.exports = {
  changePassword,
  deleteUser,
};
