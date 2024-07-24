// db.js

const { Sequelize } = require("sequelize");
const { MongoClient } = require("mongodb");

function connectToMySQL(dbName, username, password, host, port) {
  return new Sequelize(dbName, username, password, {
    host: host || "localhost",
    dialect: "mysql",
    port: port || 3306,
  });
}

function connectToPostgreSQL(dbName, username, password, host, port) {
  return new Sequelize(dbName, username, password, {
    host: host || "localhost",
    dialect: "postgres",
    port: port || 5432,
  });
}

async function connectToSQLite(dbName) {
  return new Sequelize({
    dialect: "sqlite",
    storage: dbName, // Path to SQLite database file
  });
}

function connectToOracle(username, password, host, port, serviceName) {
  return new Sequelize({
    username: username,
    password: password,
    dialect: "oracle",
    dialectOptions: {
      connectString: `${host}:${port}/${serviceName}`,
    },
  });
}

async function connectToMongoDB(mongoURI) {
  try {
    const client = new MongoClient(mongoURI);
    await client.connect();
    return client;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
}

module.exports = {
  connectToMySQL,
  connectToPostgreSQL,
  connectToOracle,
  connectToSQLite,
  connectToMongoDB,
};
