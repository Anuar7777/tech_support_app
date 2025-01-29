const { Question, Answer } = require("./../../models");
const getVector = require("./../embeddingAPI/embedding");

const createQuestion = async (req, res) => {
  try {
    const { answer_id, question } = req.body;
    const currentUser = req.user.user_id;

    if (!answer_id || !question || !question.trim()) {
      res.cookie("error", "Отсутствует ответ или вопрос", {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
      });
      return res.redirect("/new/question");
    }

    const checkAnswer = await Answer.findByPk(answer_id);

    if (!checkAnswer) {
      res.cookie("error", "Такой ответ не существует", {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
      });
      return res.redirect("/new/question");
    }

    let question_vector;
    try {
      question_vector = await getVector(question);
    } catch (vectorError) {
      console.error("Ошибка векторизации:", vectorError.message);
      res.cookie("error", "Ошибка векторизации вопроса", {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
      });
      return res.redirect("/new/question");
    }

    await Question.create({
      question: question.trim(),
      answer_id: answer_id,
      question_vector,
      created_at: new Date(),
      created_by: currentUser,
      modified_at: new Date(),
      modified_by: currentUser,
    });

    return res.redirect("/questions");
  } catch (error) {
    console.error("Ошибка сервера во время создания вопроса:", error.message);
    res.cookie("error", "Ошибка сервера во время создания вопроса", {
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
    });
    return res.redirect("/new/question");
  }
};

const editQuestion = async (req, res) => {
  const question_id = req.params.id;
  const currentUser = req.user.user_id;

  try {
    const { question, answer_id } = req.body;

    if (!answer_id || !question || !question.trim()) {
      res.cookie("error", "Некорректные данные", {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
      });
      return res.redirect("/edit/question/" + question_id);
    }

    const checkAnswer = await Answer.findByPk(answer_id);

    if (!checkAnswer) {
      res.cookie("error", "Такой ответ не существует", {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
      });
      return res.redirect("/edit/question/" + question_id);
    }

    let question_vector;
    try {
      question_vector = await getVector(question);
    } catch (vectorError) {
      console.error("Ошибка векторизации:", vectorError.message);
      res.cookie("error", "Ошибка векторизации вопроса", {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
      });
      return res.redirect("/edit/question/" + question_id);
    }

    await Question.update(
      {
        question: question.trim(),
        answer_id,
        question_vector,
        modified_at: new Date(),
        modified_by: currentUser,
      },
      {
        where: { question_id: question_id },
      }
    );

    return res.redirect("/questions");
  } catch (error) {
    res.cookie("error", "Ошибка сервера во время редактирования вопроса", {
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
    });
    console.error("Ошибка во время редактирования вопроса: " + error.message);
    return res.redirect("/edit/question/" + question_id);
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const question_id = req.params.id;
    const question = await Question.findByPk(question_id);

    if (!question) {
      res.cookie("error", "Вопрос не найден в базе данных", {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
      });
      return res.redirect("/questions");
    }

    await question.destroy();

    res.redirect("/questions");
  } catch (error) {
    res.cookie("error", "Ошибка сервера во время удаления вопроса", {
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
    });
    console.error("Ошибка при удалении вопроса:", error.message);
    res.redirect("/questions");
  }
};

module.exports = {
  createQuestion,
  editQuestion,
  deleteQuestion,
};
