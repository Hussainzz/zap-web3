import db  from "../models"
import contract from "../models/contract";
import event from "../models/event";
import flowaction from "../models/flowaction";
import flow from "../models/flow";
import appendpoints from "../models/appendpoints";
import usersapps from "../models/userapps";
import apps from "../models/apps";


const contractModel = contract(db?.sequelize, db?.Sequelize);
const eventModel = event(db?.sequelize, db?.Sequelize);
const flowActionModel = flowaction(db?.sequelize, db?.Sequelize);
const flowModel = flow(db?.sequelize, db?.Sequelize);
const appEndpointModel = appendpoints(db?.sequelize, db?.Sequelize);
const userAppsModel = usersapps(db?.sequelize, db?.Sequelize);
const AppModel = apps(db?.sequelize, db?.Sequelize);

const insertEvent = async (data: any, transaction = null) => {
  try {
    const options: any = {};
    if (transaction) {
      options.transaction = transaction;
    }
    const result = await eventModel.create(data, options);
    return result;
  } catch (error: any) {
    console.log(error.message);
  }
  return null;
};

const getEventContractInfo = async (where: any) => {
  try {
    const data = await eventModel.findOne({
      where: where,
      include: {
        model: contractModel,
        attributes: ["contract_address", "abi", "chainName", "chainId"],
      },
    });
    return data;
  } catch (error) {}
  return null;
};

const updateEventRecord = async (where: any, updateData: any) => {
  try {
    await eventModel.update(updateData, {
      where,
    });
  } catch (error: any) {
    console.log(error.message);
  }
};

const getEventActions = async (flowId: any) => {
  try {
    const flowActions = await flowActionModel.findAll({
      attributes: [["id", "actionId"], "actionPayload"],
      where: {
        flowId: flowId,
      },
      include: [
        {
          model: flowModel,
          attributes: ["flow_name"],
        },
        {
          model: appEndpointModel,
          attributes: [
            "endpoint_key",
            "endpoint_type",
            "endpoint_url",
            "endpoint_payload",
          ],
          include: [
            {
              model: AppModel,
              attributes: ["app_key"],
              include: [
                {
                  model: userAppsModel,
                  attributes: ["access_token", "response_payload"],
                },
              ],
            },
          ],
        },
      ],
    });
    return flowActions.map((action) => action.get({ plain: true }));
  } catch (error: any) {
    console.log(error.message);
  }
  return null;
};

const getEventFlowRecord = async(where: any, attributes=[]) => {
    try {
        const options: any = {
            where: where,
            include:[
                {
                    model: flowModel,
                    attributes: [['id', 'flowId'], 'flow_name', 'flowPayload']
                },
                {
                    model: contractModel,
                    attributes: ["contract_address", "abi", "chainName", "chainId"],
                }
            ]
        };
        if(attributes.length){
            options.attributes = attributes
        }
        const result = await eventModel.findOne(options);
        if(result){
            return result.get({ plain: true });
        }
    } catch (error: any) {
        console.log(error.message);
    }
    return null;
}

export {
  insertEvent,
  getEventContractInfo,
  updateEventRecord,
  getEventActions,
  getEventFlowRecord
};
