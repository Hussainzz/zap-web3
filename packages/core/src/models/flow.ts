"use strict";
import { Model, Sequelize } from "sequelize";


interface FlowAttributes {
  id: number;
  eventId: number;
  flow_name: string;
  flow_description: string;
  flowPayload: any; //JSON
}

export default (sequelize: Sequelize, DataTypes: any) => {
  class Flow extends Model<FlowAttributes> implements FlowAttributes {
    id  !: number;
    eventId !: number;
    flow_name !: string;
    flow_description  !: string;
    flowPayload  !: any; //JSON
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      Flow.belongsTo(models.Event, {
        foreignKey: 'eventId',
      });

      models.Event.hasOne(models.Flow, {
        foreignKey: 'eventId',
      });

      Flow.hasMany(models.FlowAction, {
        onDelete: "cascade",
        foreignKey: "flowId",
      });
    }
  }
  Flow.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      eventId: DataTypes.INTEGER,
      flow_name: DataTypes.STRING,
      flow_description: DataTypes.TEXT,
      flowPayload: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "Flow",
    }
  );
  Flow.associate(sequelize.models);
  return Flow;
};
