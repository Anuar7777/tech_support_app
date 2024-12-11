"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    static associate(models) {
      // Определяем ассоциации с другими моделями
      // Один пользователь может создать много ответов
      this.belongsTo(models.User, {
        foreignKey: "created_by", // связь с пользователем, который создал
        as: "creator", // псевдоним для ассоциации
      });

      this.belongsTo(models.User, {
        foreignKey: "modified_by", // связь с пользователем, который изменил
        as: "modifier", // псевдоним для ассоциации
      });

      // Один ответ может иметь много вопросов
      this.hasMany(models.Question, {
        foreignKey: "answer_id", // связь с вопросами, связанными с ответом
        as: "questions", // псевдоним для ассоциации
      });
    }
  }

  Answer.init(
    {
      answer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      answer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // по умолчанию текущая дата
      },
      created_by: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users", // связь с таблицей Users
          key: "user_id",
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
          key: "user_id",
        },
      },
    },
    {
      sequelize,
      modelName: "Answer",
      tableName: "answers", // имя таблицы в базе данных
      timestamps: false, // если хотите вручную управлять полями created_at и modified_at
    }
  );

  return Answer;
};
