"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Создание таблицы Users
    await queryInterface.createTable("users", {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "support",
      },
      isValidate: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // Создание таблицы Answers
    await queryInterface.createTable("answers", {
      answer_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      answer: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      modified_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      modified_by: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "user_id",
        },
      },
    });

    // Создание таблицы Questions
    await queryInterface.createTable("questions", {
      question_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      question: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      question_vector: {
        type: Sequelize.ARRAY(Sequelize.FLOAT),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      modified_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      modified_by: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      answer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "answers",
          key: "answer_id",
        },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Удаление таблиц, если миграция откатывается
    await queryInterface.dropTable("questions");
    await queryInterface.dropTable("answers");
    await queryInterface.dropTable("users");
  },
};
