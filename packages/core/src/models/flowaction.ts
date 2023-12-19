"use strict";
import { Model, Sequelize } from "sequelize";

interface FlowActionAttributes {
  id: number;
  flowId: number;
  actionPayload: any; //JSON
  appEndpointId: number;
}

export default (sequelize: Sequelize, DataTypes: any) => {
  class FlowAction
    extends Model<FlowActionAttributes>
    implements FlowActionAttributes
  {
    id  !: number;
    flowId  !: number;
    actionPayload !: any; //JSON
    appEndpointId !: number;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      FlowAction.belongsTo(models.Flow);
      FlowAction.belongsTo(models.AppEndpoint);
    }
  }
  FlowAction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      flowId: DataTypes.INTEGER,
      actionPayload: DataTypes.JSON,
      appEndpointId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "FlowAction",
      tableName: "flowActions"
    }
  );
  return FlowAction;
};
