import db  from "../models"
import contract from "../models/contract";
const contractModel = contract(db?.sequelize, db?.Sequelize);

const createNewContract = async (data: any, transaction = null) => {
    try {
        const options: any= {};
        if (transaction) {
            options.transaction = transaction;
        }
        const result = await contractModel.create(data, options);
        return result;
    } catch (error: any) {
        console.log(error.message);
    }
    return null;
};


const getContract = async (whereObj: any) => {
    const contract = await contractModel.findOne(whereObj);
    return contract;
}

export {
    getContract,
    createNewContract
}