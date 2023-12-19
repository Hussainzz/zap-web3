"use strict";
import { Model, Sequelize } from "sequelize";

interface ContractAttributes {
  id: number;
  contract_address: string;
  chainName: string;
  chainId: number;
  abi: any; //JSON ABI STRING
}

export default (sequelize: Sequelize, DataTypes: any) => {
  class Contract extends Model<ContractAttributes> implements ContractAttributes {
    id!: number;
    contract_address!: string;
    chainName!: string;
    chainId!: number;
    abi: any; //JSON ABI STRING
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      
    }
  }
  Contract.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      contract_address: DataTypes.STRING,
      chainName: DataTypes.STRING,
      chainId: DataTypes.INTEGER,
      abi: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "Contract",
      tableName: "contracts"
    }
  );

  return Contract;
};
