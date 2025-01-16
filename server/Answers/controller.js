const { Answer } = require("../../models");

const createAnswer = async (req, res) => {
  try {
    const answer = req.body.answer;
    const currentUser = req.user.userId;

    if (!answer || !answer.trim()) {
      res.cookie("error", "Ответ пуст", {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
      });
      return res.redirect("/new/answer");
    }

    await Answer.create({
      answer: answer.trim(),
      created_at: new Date(),
      created_by: currentUser,
      modified_at: new Date(),
      modified_by: currentUser,
    });

    return res.redirect("/answers");
  } catch (error) {
    res.cookie("error", "Ошибка сервера", {
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
    });
    console.log(error.message);
    return res.redirect("/new/answer");
  }
};

const editAnswer = async (req, res) => {
  const answer_id = req.params.id;
  const currentUser = req.user.userId;

  try {
    const answer = req.body.answer;

    if (!answer || !answer.trim()) {
      res.cookie("error", "Ответ пуст", {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
      });
      return res.redirect("/edit/answer/" + answer_id);
    }

    const checkAnswer = await Answer.findByPk(answer_id);
    if (!checkAnswer) {
      res.cookie("error", "Ответ не найден в базе данных", {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
      });
      return res.redirect("/answers");
    }

    await Answer.update(
      {
        answer: answer.trim(),
        modified_at: new Date(),
        modified_by: currentUser,
      },
      {
        where: { answer_id: answer_id },
      }
    );

    return res.redirect("/answers");
  } catch (error) {
    res.cookie("error", "Ошибка сервера", {
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
    });
    console.log(error.message);
    return res.redirect("/edit/answer/" + answer_id);
  }
};

const deleteAnswer = async (req, res) => {
  try {
    const answer_id = req.params.id;
    const answer = await Answer.findByPk(answer_id);

    if (!answer) {
      res.cookie("error", "Ответ не найден в базе данных", {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
      });
      return res.redirect("/answers");
    }

    await answer.destroy();

    return res.redirect("/answers");
  } catch (error) {
    res.cookie("error", "Ошибка сервера при удалении ответа", {
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
    });
    console.log(error.message);
    return res.redirect("/answers");
  }
};

module.exports = {
  createAnswer,
  editAnswer,
  deleteAnswer,
};
