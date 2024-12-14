"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    static associate(models) {
      this.belongsTo(models.Answer, {
        foreignKey: "answer_id", 
        as: "answer", 
        onDelete: "CASCADE", 
      });

      this.belongsTo(models.User, {
        foreignKey: "created_by", 
        as: "creator", 
      });

      this.belongsTo(models.User, {
        foreignKey: "modified_by", 
        as: "modifier", 
      });
    }
  }

  Question.init(
    {
      question_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
      },
      question: {
        type: DataTypes.STRING,
        allowNull: false, 
      },
      question_vector: {
        type: DataTypes.ARRAY(DataTypes.FLOAT), 
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
      modelName: "Question", 
      tableName: "questions",
      timestamps: false, 
    }
  );

  return Question;
};
