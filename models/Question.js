"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    static associate(models) {
      // Связь с моделью Answer, внешний ключ на ответ
      this.belongsTo(models.Answer, {
        foreignKey: "answer_id", // внешний ключ для связи с таблицей Answers
        as: "answer", // псевдоним для ассоциации
        onDelete: "CASCADE", // каскадное удаление
      });

      // Связь с пользователем, который создал вопрос
      this.belongsTo(models.User, {
        foreignKey: "created_by", // внешний ключ для связи с таблицей Users
        as: "creator", // псевдоним для ассоциации
      });

      // Связь с пользователем, который изменил вопрос
      this.belongsTo(models.User, {
        foreignKey: "modified_by", // внешний ключ для связи с таблицей Users
        as: "modifier", // псевдоним для ассоциации
      });
    }
  }

  Question.init(
    {
      question_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // автоматически увеличиваем идентификатор
      },
      question: {
        type: DataTypes.STRING,
        allowNull: false, // обязательное поле
      },
      question_vector: {
        type: DataTypes.ARRAY(DataTypes.FLOAT), // Векторный тип данных
        allowNull: false, // обязательное поле
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // по умолчанию текущая дата
      },
      created_by: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users", // связь с таблицей Users
          key: "user_id", // внешний ключ ссылается на поле user_id в таблице Users
        },
      },
      modified_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // по умолчанию текущая дата
      },
      modified_by: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users", // связь с таблицей Users
          key: "user_id", // внешний ключ ссылается на поле user_id в таблице Users
        },
      },
    },
    {
      sequelize,
      modelName: "Question", // имя модели
      tableName: "questions", // имя таблицы в базе данных
      timestamps: false, // если хотите управлять полями вручную
    }
  );

  return Question;
};
