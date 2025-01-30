"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Query extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "createdByUser",
        onDelete: "SET NULL",
      });

      this.belongsTo(models.User, {
        foreignKey: "closed_by",
        as: "closedByUser",
        onDelete: "SET NULL",
      });
    }
  }

  Query.init(
    {
      query_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      query: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "user_id",
        },
        onDelete: "SET NULL",
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      support_answer: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      pred_question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      similarity: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      closed_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "user_id",
        },
        onDelete: "SET NULL",
      },
      closed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Query",
      tableName: "queries",
      timestamps: false,
    }
  );

  return Query;
};
