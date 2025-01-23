const bcrypt = require("bcrypt");
const { User } = require("./../../models");

const changePassword = async (req, res) => {
  try {
    const { new_password_2, user_id } = req.body;

    const currentUser = req.user;

    if (
      currentUser.user_id !== parseInt(user_id) &&
      currentUser.role !== "admin"
    ) {
      throw new Error("Вам не хватает доступа");
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      throw new Error("Пользователь не найден");
    }

    const hashedPassword = await bcrypt.hash(new_password_2, 10);

    await User.update(
      { password_hash: hashedPassword },
      { where: { user_id: user.user_id } }
    );

    res.cookie("success", "Пароль успешно изменен", {
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
    });
    return res.redirect("/user/" + user.user_id);
  } catch (error) {
    res.cookie("error", error.message, {
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
    });
    console.log(error.message);
    return res.redirect(`/user/${req.user.user_id}?error=true`);
  }
};

const changeRole = async (req, res) => {
  const { user_id } = req.body;
  try {
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    if (user_id === 1) {
      return res.status(400).render("error", {
        error: "Нельзя изменять роль главного администратора",
        pageTitle: "Упс...",
        status: 500,
        user: req.user,
      });
    }

    const newRole = user.role === "support" ? "guest" : "support";
    await user.update({ role: newRole });

    res.cookie(
      "success",
      `Роль пользователя ${user.email} изменена на ${newRole}`,
      {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
      }
    );
    res.redirect("/user/" + user.user_id);
  } catch (error) {
    console.error("Ошибка со стороны сервера", error);
    res.status(500).render("error", {
      error: error,
      pageTitle: "Упс...",
      status: 500,
      user: req.user,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id);
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    if (user.user_id === 1) {
      return res
        .status(404)
        .json({ error: "Нельзя удалять главного администратора!" });
    }

    await user.destroy();
    console.log(`Пользователь с ID ${req.user.user_id} удалён`);
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
  changeRole,
};
