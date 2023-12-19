"use strict";
import { Model, Sequelize } from "sequelize";

interface UserAppAttributes {
  id: number;
  userId: number;
  appId: number;
  access_token: string;
  response_payload: any;
}

export default (sequelize: Sequelize, DataTypes: any) => {
  class UserApp extends Model<UserAppAttributes> implements UserAppAttributes {
    id!: number;
    userId!: number;
    appId!: number;
    access_token!: string;
    response_payload!: any;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      UserApp.belongsTo(models.User, {
        foreignKey: "userId",
      });
      // UserApp.belongsTo(models.App, {
      //   foreignKey: "appId",
      // });
    }
  }
  UserApp.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: DataTypes.INTEGER,
      appId: DataTypes.INTEGER,
      access_token: DataTypes.STRING,
      response_payload: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "UserApp",
      tableName: "userApps",
    }
  );

  UserApp.associate(sequelize.models);
  return UserApp;
};
