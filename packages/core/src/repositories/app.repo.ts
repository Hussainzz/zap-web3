import db from "../models";
import apps from "../models/apps";
import appendpoints from "../models/appendpoints";
import userapps from "../models/userapps";
const appModel = apps(db?.sequelize, db?.Sequelize);
const appEndpointModel = appendpoints(db?.sequelize, db?.Sequelize);
const userAppModel = userapps(db?.sequelize, db?.Sequelize);

const getApps = async (userId: number) => {
  try {
    const apps = await appModel.findAll({
      attributes: ["id", "app_name", "UserApps.userId"],
      include: [
        {
          model: userAppModel,
          where: { userId },
          attributes: [],
          required: false, // LEFT JOIN
        },
      ],
      raw: true,
    });
  } catch (error: any) {
    console.log(error?.message);
  }
};

const getAppRecord = async (where: any) => {
  try {
    const data = await appModel.findOne({
      where: where,
    });
    if (data) {
      return data.get({ plain: true });
    }
  } catch (error: any) {
    console.log(error?.message);
  }
  return null;
};

const getAppEndpoint = async (where: any, select: any) => {
  try {
    const data = await appEndpointModel.findOne({
      where: where,
      attributes: select,
    });
    if (data?.dataValues) {
      return data.dataValues;
    }
  } catch (error: any) {
    console.log(error?.message);
  }
  return null;
};

const getAppWithEndpointRecords = async (where: any) => {
  try {
    const data = await appModel.findOne({
      where: where,
      include: {
        model: appEndpointModel,
        attributes: [
          ["id", "endpointId"],
          "endpoint_name",
          "endpoint_key",
          "endpoint_description",
        ],
      },
    });
    if (data) {
      // Return the plain object representation of the data
      return data.get({ plain: true });
    }
  } catch (error: any) {
    console.log(error?.message);
  }
  return null;
};

const createUserAppsRecord = async (data: any, transaction = null) => {
  try {
    const options: any = {};
    if (transaction) {
      options.transaction = transaction;
    }
    const result = await userAppModel.create(data, options);
    return result;
  } catch (error: any) {
    console.log(error.message);
  }
  return null;
};

const getUserAppRecord = async (where: any, attributes: string[]) => {
  try {
    const options: any = {
      where,
    };
    if (attributes.length) {
      options.attributes = attributes;
    }
    const data = await userAppModel.findOne(options);
    if (data) {
      return data.get({ plain: true });
    }
  } catch (error: any) {
    console.log(error?.message);
  }
  return null;
};

const deleteUserAppRecord = async (where: any) => {
  try {
    const options: any = {
      where,
    };
    await userAppModel.destroy(options);
    return true;
  } catch (error: any) {
    console.log(error?.message);
  }
  return false;
};

export {
  getApps,
  getAppRecord,
  getAppWithEndpointRecords,
  createUserAppsRecord,
  getUserAppRecord,
  getAppEndpoint,
  deleteUserAppRecord,
};
