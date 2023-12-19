'use strict';
import { Model, Sequelize } from "sequelize";

interface AppEndpointAttributes {
  id: number;
  appId: number;
  endpoint_key: string;
  endpoint_name: string;
  endpoint_description: string;
  endpoint_type: string;
  endpoint_url: string;
  endpoint_payload: any;
}

export default (sequelize: Sequelize, DataTypes: any) => {
  class AppEndpoint extends Model<AppEndpointAttributes> implements AppEndpointAttributes {
    id !: number;
    appId !: number;
    endpoint_key !: string;
    endpoint_name !: string;
    endpoint_description !: string;
    endpoint_type !: string;
    endpoint_url !: string;
    endpoint_payload !: any;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      AppEndpoint.belongsTo(models.App, {
        foreignKey: 'appId',
      });
    }
  }
  AppEndpoint.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    appId: DataTypes.INTEGER,
    endpoint_key: DataTypes.STRING,
    endpoint_name: DataTypes.STRING,
    endpoint_description: DataTypes.STRING,
    endpoint_type: DataTypes.STRING,
    endpoint_url: DataTypes.STRING,
    endpoint_payload: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'AppEndpoint',
    tableName: "appEndpoints"
  });
  return AppEndpoint;
};