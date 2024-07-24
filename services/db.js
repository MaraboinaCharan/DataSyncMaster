const { Sequelize } = require("sequelize");
const { MongoClient } = require("mongodb");
/**
 * @param {takes the database connection inputs}
 * @returns {returns th connected sequelize}
 */ 
async function connectToMySQL(dbName, username, password, host, type) {
  let sequelize = new Sequelize(dbName, username, password, {
    host: host,
    dialect: "mysql",
  });
  try {
    await sequelize.authenticate();
    return sequelize;
  } catch (error) {
    throw new Error(`Invalid database credentials for ${type}`);
  }
}

/**
 * @param {takes the database connection inputs}
 * @returns {returns th connected sequelize}
 */
async function connectToPostgreSQL(dbName, username, password, host, type) {
  let sequelize = new Sequelize(dbName, username, password, {
    host: host || "localhost",
    dialect: "postgres",
  });
  try {
    await sequelize.authenticate();
    return sequelize;
  } catch (error) {
    throw new Error(`Invalid database credentials for ${type}`);
  }
}

/**
 * @param {takes the database connection inputs}
 * @returns {returns th connected sequelize}
 */
async function connectToSQLite(dbName, type) {
  let sequelize = new Sequelize({
    dialect: "sqlite",
    storage: '"C:/Users/Charan/Desktop/sqlite3.db"',
  });
  try {
    await sequelize.authenticate();
    return sequelize;
  } catch (error) {
    throw new Error(`Invalid database credentials for ${type}`);
  }
}

/**
 * @param {takes the database connection inputs}
 * @returns {returns th connected sequelize}
 */
async function connectToOracle(username, password, host, port, type) {
  let sequelize = new Sequelize({
    username: username,
    password: password,
    dialect: "oracle",
    dialectOptions: { connectString: `${host}:${port}/orcl` },
  });
  try {
    await sequelize.authenticate();
    return sequelize;
  } catch (error) {
    throw new Error(`Invalid database credentials for ${type}`);
  }
}
/**
 * @param {takes the database connection inputs}
 * @returns {returns th connected client}
 */

async function connectToMongoDB(mongoURI, dbName, type) {
  try {
    const client = new MongoClient(mongoURI);
    await client.connect().then(() => {});

    return client;
  } catch (err) {
    throw new Error(`Invalid database credentials for ${type}`);
  }
}

module.exports = {
  connectToMySQL,
  connectToPostgreSQL,
  connectToOracle,
  connectToSQLite,
  connectToMongoDB,
};

/* testing purpose*/
const { Module } = require("module");
const oracledb = require("oracledb");
const sequelize = new Sequelize({
  username: "SYSTEM",
  password: "root",
  dialect: "oracle",
  dialectOptions: { connectString: "localhost:1521/orcl" },
});
module.exports.oracle = async (req, res) => {
  try {
    await sequelize.authenticate().then(async () => {
      console.log("Success: Oracle database connection established");
      const results = await sequelize.query("SELECT * from testing;");

      console.log(results, "as result");
      res.json({ results: results });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
