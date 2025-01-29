const axios = require("axios");
const { Message } = require("../../models");

const sendMessage = async (req, res) => {
  try {
    const { chat_id, text } = req.body;

    if (chat_id != req.user.user_id || !text.trim()) {
      return res.redirect(`/chat/${req.user.user_id}`);
    }

    await Message.create({
      user_id: chat_id,
      text,
      date: new Date(),
      type: "query",
    });

    let response_api;
    try {
      response_api = await axios.post(
        "http://127.0.0.1:8000/find_similar_pro/",
        {
          text,
          created_by: chat_id,
        }
      );
    } catch (response_api_error) {
      console.error(
        "Ошибка при подключении к API:",
        response_api_error.message
      );
      await Message.create({
        user_id: chat_id,
        text: "Ошибка сервера: не удалось подключиться к обработчику сообщений.",
        date: new Date(),
        type: "response",
      });
      return res.redirect(`/chat/${req.user.user_id}`);
    }

    const { answer, question, similarity } = response_api.data;

    await Message.create({
      user_id: chat_id,
      text: answer,
      date: new Date(),
      type: "response",
    });

    return res.redirect("/chat/" + req.user.user_id);
  } catch (error) {
    res.cookie("error", "Ошибка сервера", {
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
    });
    console.log(error.message);
    return res.redirect(`/chat/${req.user.user_id}`);
  }
};

module.exports = {
  sendMessage,
};
