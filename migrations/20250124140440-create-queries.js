"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("queries", {
      query_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      query: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "user_id",
        },
        onDelete: "SET NULL",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      support_answer: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      pred_question: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      similarity: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      closed_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "user_id",
        },
        onDelete: "SET NULL",
      },
      closed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("queries");
  },
};
