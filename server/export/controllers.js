const { Query, Answer, Question, User } = require("./../../models");
const { Op } = require("sequelize");
const ExcelJS = require("exceljs");

const exportQueries = async (req, res) => {
  const { search } = req.query;
  try {
    const searchCondition = search
      ? {
          query: {
            [Op.iLike]: `%${search}%`,
          },
        }
      : {};

    const queries = await Query.findAll({
      where: searchCondition,
      include: [
        {
          model: User,
          as: "createdByUser",
          attributes: ["email"],
        },
        {
          model: User,
          as: "closedByUser",
          attributes: ["email"],
        },
      ],
      raw: true,
    });

    const processedQueries = queries.map((query) => ({
      ...query,
      "createdByUser.email": query["createdByUser.email"] || "Аккаунт удален",
      closed_at: query.closed_at || "Ожидает обработки",
      "closedByUser.email": query["closedByUser.email"] || "Ожидает обработки",
    }));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Запросы");

    worksheet.columns = [
      { header: "ID", key: "query_id", width: 10 },
      { header: "Запрос пользователя", key: "query", width: 50 },
      { header: "Ответ поддержки", key: "support_answer", width: 50 },
      { header: "Похожий вопрос", key: "pred_question", width: 50 },
      { header: "Схожесть", key: "similarity", width: 15 },
      { header: "Дата создания", key: "created_at", width: 20 },
      { header: "Создано", key: "createdByUser.email", width: 30 },
      { header: "Дата выполнения", key: "closed_at", width: 20 },
      { header: "Выполнено", key: "closedByUser.email", width: 30 },
    ];

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { name: "Times New Roman", size: 12, bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFBFBFBF" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    processedQueries.forEach((query) => {
      const row = worksheet.addRow(query);
      row.eachCell((cell) => {
        cell.font = { name: "Times New Roman", size: 12 };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="queries.xlsx"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Ошибка при экспорте запросов:", error);
    res.status(500).render("error", {
      error: "Ошибка сервера: " + error,
      pageTitle: "Упс...",
      status: 500,
      user: req.user,
    });
  }
};

const exportUsers = async (req, res) => {
  const { search } = req.query;
  try {
    const searchValue = search ? { email: { [Op.iLike]: `%${search}%` } } : {};

    const users = await User.findAll({
      where: searchValue,
      attributes: ["user_id", "email", "role", "createdAt", "updatedAt"],
      raw: true,
    });

    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        const [
          closedQueriesCount,
          createdQuestionCount,
          updatedQuestionCount,
          createdAnswerCount,
          updatedAnswerCount,
        ] = await Promise.all([
          Query.count({ where: { closed_by: user.user_id } }),
          Question.count({ where: { created_by: user.user_id } }),
          Question.count({ where: { modified_by: user.user_id } }),
          Answer.count({ where: { created_by: user.user_id } }),
          Answer.count({ where: { modified_by: user.user_id } }),
        ]);

        return {
          ...user,
          closedQueriesCount,
          createdQuestionCount,
          updatedQuestionCount,
          createdAnswerCount,
          updatedAnswerCount,
        };
      })
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Пользователи");

    worksheet.columns = [
      { header: "Email", key: "email", width: 30 },
      { header: "Роль", key: "role", width: 20 },
      { header: "Выполнено (Запросы)", key: "closedQueriesCount", width: 30 },
      { header: "Создано (Вопросы)", key: "createdQuestionCount", width: 30 },
      { header: "Изменено (Вопросы)", key: "updatedQuestionCount", width: 30 },
      { header: "Создано (Ответы)", key: "createdAnswerCount", width: 30 },
      { header: "Изменено (Ответы)", key: "updatedAnswerCount", width: 30 },
      { header: "Дата создания", key: "createdAt", width: 20 },
      { header: "Дата изменения", key: "updatedAt", width: 20 },
    ];

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { name: "Times New Roman", size: 12, bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFBFBFBF" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    enrichedUsers.forEach((user) => {
      const row = worksheet.addRow(user);
      row.eachCell((cell) => {
        cell.font = { name: "Times New Roman", size: 12 };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="users.xlsx"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Ошибка при экспорте данных:", error);
    res.status(500).render("error", {
      error: "Ошибка сервера: " + error,
      pageTitle: "Упс...",
      status: 500,
      user: req.user,
    });
  }
};

const exportAnswers = async (req, res) => {
  const { search } = req.query;
  try {
    const answers = await Answer.findAll({
      where: search
        ? {
            answer: {
              [Op.iLike]: `%${search}%`,
            },
          }
        : {},
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["email"],
        },
        {
          model: User,
          as: "modifier",
          attributes: ["email"],
        },
        {
          model: Question,
          as: "questions",
          attributes: ["question"],
        },
      ],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Ответы");

    worksheet.columns = [
      { header: "ID", key: "ID", width: 10 },
      { header: "Ответ", key: "Ответ", width: 50 },
      { header: "Вопрос", key: "Вопрос", width: 50 },
      { header: "Дата изменения", key: "Дата изменения", width: 20 },
      { header: "Изменено", key: "Изменено", width: 25 },
      { header: "Дата создания", key: "Дата создания", width: 20 },
      { header: "Создано", key: "Создано", width: 25 },
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = {
        name: "Times New Roman",
        size: 12,
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFBFBFBF" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    let rowIndex = 2;

    answers.forEach((answer) => {
      const startRow = rowIndex;

      if (answer.questions.length === 0) {
        const row = worksheet.addRow({
          ID: answer.answer_id,
          Ответ: answer.answer,
          Вопрос: "Нет связанного вопроса",
          "Дата изменения": answer.modified_at,
          Изменено: answer.modifier?.email || "Не указано",
          "Дата создания": answer.created_at,
          Создано: answer.creator?.email || "Не указано",
        });
        row.eachCell((cell) => {
          cell.font = { name: "Times New Roman", size: 12 };
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
        rowIndex++;
      } else {
        answer.questions.forEach((question) => {
          const row = worksheet.addRow({
            ID: "",
            Ответ: "",
            Вопрос: question.question,
            "Дата изменения": "",
            Изменено: "",
            "Дата создания": "",
            Создано: "",
          });
          row.eachCell((cell) => {
            cell.font = { name: "Times New Roman", size: 12 };
            cell.alignment = { vertical: "middle", horizontal: "center" };
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          });
          rowIndex++;
        });

        if (answer.questions.length > 0) {
          worksheet.mergeCells(`A${startRow}:A${rowIndex - 1}`);
          worksheet.mergeCells(`B${startRow}:B${rowIndex - 1}`);
          worksheet.mergeCells(`D${startRow}:D${rowIndex - 1}`);
          worksheet.mergeCells(`E${startRow}:E${rowIndex - 1}`);
          worksheet.mergeCells(`F${startRow}:F${rowIndex - 1}`);
          worksheet.mergeCells(`G${startRow}:G${rowIndex - 1}`);

          worksheet.getCell(`A${startRow}`).value = answer.answer_id;
          worksheet.getCell(`B${startRow}`).value = answer.answer;
          worksheet.getCell(`D${startRow}`).value = answer.modified_at;
          worksheet.getCell(`E${startRow}`).value =
            answer.modifier?.email || "Не указано";
          worksheet.getCell(`F${startRow}`).value = answer.created_at;
          worksheet.getCell(`G${startRow}`).value =
            answer.creator?.email || "Не указано";

          ["A", "B", "D", "E", "F", "G"].forEach((col) => {
            const cell = worksheet.getCell(`${col}${startRow}`);
            cell.font = { name: "Times New Roman", size: 12 };
            cell.alignment = { vertical: "middle", horizontal: "center" };
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          });
        }
      }
    });

    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.font = { name: "Times New Roman", size: 12 };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    res.setHeader("Content-Disposition", "attachment; filename=answers.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    const buffer = await workbook.xlsx.writeBuffer();
    res.send(buffer);
  } catch (error) {
    console.error("Ошибка при экспорте данных:", error);
    res.status(500).render("error", {
      error: "Ошибка сервера: " + error,
      pageTitle: "Упс...",
      status: 500,
      user: req.user,
    });
  }
};

const exportQuestions = async (req, res) => {
  const { search } = req.query;

  try {
    const questions = await Question.findAll({
      where: search
        ? {
            question: {
              [Op.iLike]: `%${search}%`,
            },
          }
        : {},
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["email"],
        },
        {
          model: User,
          as: "modifier",
          attributes: ["email"],
        },
        {
          model: Answer,
          as: "answer",
          attributes: ["answer"],
        },
      ],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Вопросы");

    worksheet.columns = [
      { header: "ID", key: "ID", width: 10 },
      { header: "Вопрос", key: "Вопрос", width: 50 },
      { header: "Ответ", key: "Ответ", width: 50 },
      { header: "Дата изменения", key: "Дата изменения", width: 20 },
      { header: "Изменено", key: "Изменено", width: 25 },
      { header: "Дата создания", key: "Дата создания", width: 20 },
      { header: "Создано", key: "Создано", width: 25 },
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = {
        name: "Times New Roman",
        size: 12,
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFBFBFBF" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    questions.forEach((question) => {
      worksheet.addRow({
        ID: question.question_id,
        Вопрос: question.question,
        Ответ: question.answer?.answer || "",
        "Дата изменения": question.modified_at,
        Изменено: question.modifier.email,
        "Дата создания": question.created_at,
        Создано: question.creator.email,
      });
    });

    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        cell.font = { name: "Times New Roman", size: 12 };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        if (
          rowNumber === 1 ||
          [
            "ID",
            "Дата создания",
            "Создано",
            "Дата изменения",
            "Изменено",
          ].includes(worksheet.getColumn(colNumber).key)
        ) {
          cell.alignment = { vertical: "middle", horizontal: "center" };
        }
      });
    });

    res.setHeader("Content-Disposition", "attachment; filename=questions.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    const buffer = await workbook.xlsx.writeBuffer();
    res.send(buffer);
  } catch (error) {
    console.error("Ошибка при экспорте данных:", error);
    res.status(500).render("error", {
      error: "Ошибка сервера: " + error,
      pageTitle: "Упс...",
      status: 500,
      user: req.user,
    });
  }
};

module.exports = {
  exportAnswers,
  exportQuestions,
  exportUsers,
  exportQueries,
};
