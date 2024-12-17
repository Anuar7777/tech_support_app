"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator", 
      });

      this.belongsTo(models.User, {
        foreignKey: "modified_by", 
        as: "modifier", 
      });

      this.hasMany(models.Question, {
        foreignKey: "answer_id", 
        as: "questions", 
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
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      created_by: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users", 
          key: "user_id",
        },
      },
      modified_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, 
      },
      modified_by: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users", 
          key: "user_id",
        },
      },
    },
    {
      sequelize,
      modelName: "Answer",
      tableName: "answers", 
      timestamps: false, 
    }
  );

  return Answer;
};
