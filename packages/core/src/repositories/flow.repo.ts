import db  from "../models"
import flow from "../models/flow";
import { insertEvent } from "./event.repo";
const flowModel = flow(db?.sequelize, db?.Sequelize);

const getFlowRecord = async (where: any, attributes = []) => {
  try {
    const options: any = {
      where,
    };
    if (attributes.length) {
      options.attributes = attributes;
    }
    const data = await flowModel.findOne(options);
    if (data) {
      return data.get({ plain: true });
    }
  } catch (error) {}
  return null;
};

const createNewEventFlow = async (flowData: any, eventData: any) => {
  let created = false;
  let tx;
  try {
    tx = await db?.sequelize.transaction();
    const flow = await insertFlow(flowData, tx);
    if (!flow?.id) {
      throw new Error("Flow creation failed");
    }
    const event = await insertEvent(eventData, tx);
    if (!event?.id) {
      throw new Error("Event creation failed");
    }

    // If everything is successful, commit the tx
    await tx.commit();
    created = true;
  } catch (error) {
    if (tx) await tx.rollback();
  }
  return created;
};

const insertFlow = async (data: any, transaction = null) => {
  try {
    const options: any = {};
    if (transaction) {
      options.transaction = transaction;
    }
    const result = await flowModel.create(data, options);
    return result;
  } catch (error: any) {
    console.log(error.message);
  }
  return null;
};

export {
  createNewEventFlow,
  getFlowRecord
};
