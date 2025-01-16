const { Answer, Question, User } = require("./../../models");
const { Op } = require("sequelize");
const ExcelJS = require("exceljs");

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
    console.error("Ошибка при экспорте ответов: ", error);
    res.status(500).json({ message: "Ошибка при экспорте ответов" });
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
    console.error("Ошибка при экспорте вопросов: ", error);
    res.status(500).json({ message: "Ошибка при экспорте вопросов" });
  }
};

module.exports = {
  exportAnswers,
  exportQuestions,
};
