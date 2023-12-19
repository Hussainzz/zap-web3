import db  from "../models"
import flowactionlogs from "../models/flowactionlogs";
const flowActionLogModel = flowactionlogs(db?.sequelize, db?.Sequelize);

const createNewFlowActionLog = async (data: any, transaction = null) => {
    try {
        const options: any= {};
        if (transaction) {
            options.transaction = transaction;
        }
        const result = await flowActionLogModel.create(data, options);
        return result;
    } catch (error: any) {
        console.log(error.message);
    }
    return null;
};


const getFlowActionLog = async (whereObj: any) => {
    const log = await flowActionLogModel.findOne(whereObj);
    return log;
}

export {
    getFlowActionLog,
    createNewFlowActionLog
}