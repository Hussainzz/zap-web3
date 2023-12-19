"use strict";
import { Model, Sequelize } from "sequelize";

interface FlowActionLogAttributes {
  id: number;
  flowId: number;
  flowActionId: number;
  status: string;
  resultPayload: any; //JSON
}

export default (sequelize: Sequelize, DataTypes: any) => {
  class FlowActionLog
    extends Model<FlowActionLogAttributes>
    implements FlowActionLogAttributes
  {
    id  !: number;
    flowId  !: number;
    flowActionId  !: number;
    status  !: string;
    resultPayload !: any; //JSON
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {

    }
  }
  FlowActionLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      flowId: DataTypes.INTEGER,
      flowActionId: DataTypes.INTEGER,
      status: DataTypes.STRING,
      resultPayload: DataTypes.JSON
    },
    {
      sequelize,
      modelName: "FlowActionLog",
      tableName: "flowActionLogs"
    }
  );
  return FlowActionLog;
};
