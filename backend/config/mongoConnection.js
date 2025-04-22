const MongoClient = require("mongodb").MongoClient;
const settings = require("./settings");
const dotenv = require("dotenv");
dotenv.config();

const mongoConfig = {
  serverUrl: process.env.MONGO_SERVER_URL || settings.mongoConfig.serverUrl,
  database: process.env.MONGO_DATABASE || settings.mongoConfig.database,
}

let _connection = undefined;
let _db = undefined;

module.exports = {
  dbConnection: async () => {
    if (!_connection) {
      _connection = await MongoClient.connect(mongoConfig.serverUrl);
      _db = await _connection.db(mongoConfig.database);
    }

    return _db;
  },
  closeConnection: () => {
    _connection.close();
  },
};