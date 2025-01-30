const { Query, User, Message, Question, Answer } = require("../../models");
const getVector = require("./../EmbeddingAPI/embedding");

const sendQuery = async (req, res) => {
  const { query_id, query, created_by, answer } = req.body;
  const currentUser = req.user;

  try {
    if (!answer || !answer.trim()) {
      res.cookie("error", "Запрос пуст", {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
      });
      return res.redirect(`/edit/query/${query_id}`);
    }

    if (created_by) {
      const recipient = await User.findOne({
        where: { user_id: created_by },
        attributes: ["email"],
      });

      const support_answer = `
        Здравствуйте, ${recipient.email}! Мы рассмотрели Ваш запрос.
        Текст запроса: ${query}
        Ответ: ${answer}
        `;

      await Message.create({
        user_id: created_by,
        text: support_answer,
        date: new Date(),
        type: "response",
      });
    }

    await Query.update(
      {
        support_answer: answer,
        closed_by: currentUser.user_id,
        closed_at: new Date(),
      },
      {
        where: { query_id: query_id },
      }
    );

    return res.redirect("/queries");
  } catch (error) {
    console.log("Ошибка при закрытии запроса: ", error.message);
    res.cookie("error", "Ошибка сервера при закрытии запроса", {
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
    });
    return res.redirect(`/edit/query/${query_id}`);
  }
};

const saveQuery = async (req, res) => {
  const query_id = req.params.id;
  const currentUser = req.user;

  try {
    const query = await Query.findOne({
      where: { query_id: query_id },
      attributes: ["query", "support_answer", "closed_by"],
    });

    if (!query) {
      res.cookie("error", "Запрос не найден", {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
      });
      return res.redirect("/queries");
    }

    if (!query.closed_by) {
      res.cookie("error", "Запрос не закрыт", {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
      });
      return res.redirect(`/edit/query/${query_id}`);
    }

    const answer = await Answer.create({
      answer: query.support_answer,
      created_by: currentUser.user_id,
      created_at: new Date(),
      modified_by: currentUser.user_id,
      modified_at: new Date(),
    });

    let question_vector;
    try {
      question_vector = await getVector(query.query);
    } catch (vectorError) {
      console.error("Ошибка векторизации:", vectorError.message);
      res.cookie("error", "Ошибка векторизации вопроса", {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
      });
      return res.redirect(`/query/${query_id}`);
    }

    await Question.create({
      question: query.query,
      answer_id: answer.answer_id,
      created_by: currentUser.user_id,
      question_vector,
      created_at: new Date(),
      modified_by: currentUser.user_id,
      modified_at: new Date(),
    });

    return res.redirect("/queries");
  } catch (error) {
    console.log("Ошибка при сохранении запроса: ", error.message);
    res.cookie("error", "Ошибка сервера при сохранении запроса", {
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
    });
    return res.redirect(`/query/${query_id}`);
  }
};

module.exports = { sendQuery, saveQuery };
