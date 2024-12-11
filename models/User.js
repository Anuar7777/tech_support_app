"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  User.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Указываем, что это первичный ключ
        autoIncrement: true, // Автоматическое увеличение
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, 
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "support",
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users", 
    }
  );

  return User;
};
