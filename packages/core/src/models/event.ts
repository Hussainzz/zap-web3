"use strict";
import { Model, Sequelize } from "sequelize";

interface EventAttributes {
  id: number;
  userId: number;
  event_name: string;
  event_payload: any; //JSON
  event_description: string;
  contractId: number;
  is_active: number;
}

export default (sequelize: Sequelize, DataTypes: any) => {
  class Event extends Model<EventAttributes> implements EventAttributes {
    id!: number;
    userId!: number;
    event_name!: string;
    event_payload!: any; //JSON
    event_description!: string;
    contractId!: number;
    is_active!: number;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      Event.belongsTo(models.Contract, {
        foreignKey: "contractId",
      });

      models.Contract.hasMany(Event);

      Event.belongsTo(models.User, {
        foreignKey: "userId",
      });

      // Event.hasOne(models.Flow, {
      //   foreignKey: 'eventId',
      // });
    }
  }
  Event.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: DataTypes.INTEGER,
      event_name: DataTypes.STRING,
      event_payload: DataTypes.JSON,
      event_description: DataTypes.TEXT,
      contractId: DataTypes.INTEGER,
      is_active: DataTypes.TINYINT,
    },
    {
      sequelize,
      modelName: "Event",
    }
  );

  Event.associate(sequelize.models);
  return Event;
};
