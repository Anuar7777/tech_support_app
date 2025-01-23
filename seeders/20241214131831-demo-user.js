"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword1 = await bcrypt.hash("supportadmin", 10);
    const hashedPassword2 = await bcrypt.hash("support", 10);
    const hashedPassword3 = await bcrypt.hash("support", 10);

    return queryInterface.bulkInsert("users", [
      {
        email: "support@support.kz",
        password_hash: hashedPassword1,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "ayazhan@support.kz",
        password_hash: hashedPassword2,
        role: "support",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "test@support.kz",
        password_hash: hashedPassword3,
        role: "guest",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
