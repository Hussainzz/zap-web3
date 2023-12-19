'use strict';
import { Model, Sequelize } from "sequelize";

interface AppAttributes {
  id: number;
  app_name: string;
  app_key: string;
  app_description: string;
  app_auth_url: string;
  app_auth_payload: any; // JSON
}

export default (sequelize: Sequelize, DataTypes: any) => {
  class App extends Model<AppAttributes> implements AppAttributes {
    id !: number;
    app_name !: string;
    app_key !: string;
    app_description !: string;
    app_auth_url !: string;
    app_auth_payload !: any; // JSON
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      App.hasMany(models.AppEndpoint);
      App.hasMany(models.UserApp);
      App.belongsToMany(models.User, { through: models.UserApp, foreignKey: 'appId', });
    }
  }
  App.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    app_name: DataTypes.STRING,
    app_key: DataTypes.STRING,
    app_description: DataTypes.STRING,
    app_auth_url: DataTypes.STRING,
    app_auth_payload: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'App',
    tableName: 'apps'
  });

  App.associate(sequelize.models);

  return App;
};