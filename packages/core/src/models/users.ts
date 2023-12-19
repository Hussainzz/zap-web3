"use strict";
import { Model, Sequelize } from "sequelize";

interface UserAttributes {
  id: number;
  fullname: string;
  email: string;
  password: string;
}

export default (sequelize: Sequelize, DataTypes: any) => {
  class User extends Model<UserAttributes> implements UserAttributes {
    id!: number;
    fullname!: string;
    email!: string;
    password!: string;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      User.belongsToMany(models.App, {
        through: models.UserApp,
        foreignKey: "userId",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      fullname: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users"
    }
  );
  return User;
};
