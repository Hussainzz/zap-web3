'use strict';
import * as dotenv from "dotenv";
dotenv.config();

const db: any = {};
import { Sequelize } from 'sequelize';
const env = process.env.NODE_ENV || 'development';
const config = require("@zap/core/src/config/config.js")[env];

const  sequelize = config.url
  ? new Sequelize(config.url, {logging: false})
  : new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;