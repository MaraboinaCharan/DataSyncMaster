const { json } = require("sequelize");
const {
  connectToMySQL,
  connectToPostgreSQL,
  connectToOracle,
  connectToSQLite,
  connectToMongoDB,
} = require("./db");

const {
  fetchMongoDBSchema,
  fetchMySQLSchema,
  fetchOracleSchema,
  fetchPostgreSQLSchema,
  fetchSQLiteSchema,
} = require("./schema");

/**
 * @param {takes the connection input parameters} req
 * @param {for Successfull connection,returns the schema for source and target else returns error } res
 */

async function connectToDB(req, res) {
  console.log(req, "request body");

  const {
    1: {
      dbType: dbType1,
      dbName: dbName1,
      mongoDBName: mongoDBName1,
      mongoURI: mongoURI1,
      username: username1,
      password: password1,
      host: host1,
      port: port1,
    },
    2: {
      dbType: dbType2,
      dbName: dbName2,
      username: username2,
      password: password2,
      host: host2,
      port: port2,
      mongoDBName: mongoDBName2,
      mongoURI: mongoURI2,
    },
  } = req.body;

  try {
    if (dbType1 === "mysql") {
      sequelize1 = await connectToMySQL(
        dbName1,
        username1,
        password1,
        host1,
        port1,
        "source"
      );
    } else if (dbType1 === "postgres") {
      sequelize1 = await connectToPostgreSQL(
        dbName1,
        username1,
        password1,
        host1,
        port1,
        "source"
      );
    } else if (dbType1 === "sqlite") {
      sequelize1 = await connectToSQLite(dbName1, "source");
    } else if (dbType1 === "oracle") {
      sequelize1 = await connectToOracle(
        username1,
        password1,
        host1,
        port1,
        "source"
      );
    } else if (dbType1 === "mongodb") {
      sequelize1 = await connectToMongoDB(mongoURI1, mongoDBName1, "source");
    }
  } catch (error) {
    throw new Error("Invalid database credentials for Source");
  }

  try {
    if (dbType2 === "mysql") {
      sequelize2 = await connectToMySQL(
        dbName2,
        username2,
        password2,
        host2,
        port2,
        "Target"
      );
    } else if (dbType2 === "postgres") {
      sequelize2 = await connectToPostgreSQL(
        dbName2,
        username2,
        password2,
        host2,
        port2,
        "Target"
      );
    } else if (dbType2 === "sqlite") {
      sequelize2 = await connectToSQLite(dbName2, "Target");
    } else if (dbType2 === "oracle") {
      sequelize2 = await connectToOracle(
        username2,
        password2,
        host2,
        port2,
        "Target"
      );
    } else if (dbType2 === "mongodb") {
      sequelize2 = await connectToMongoDB(mongoURI2, mongoDBName2, "Target");
    }
  } catch (error) {
    throw new Error("Invalid database credentials for Target");
  }

  if (dbType1 === "mongodb") {
    schema1 = await fetchMongoDBSchema(sequelize1, mongoDBName1);
  } else {
    schema1 = await fetchSchema(sequelize1, dbType1, dbName1, mongoDBName1);
  }

  console.log(schema1);

  if (dbType2 === "mongodb") {
    schema2 = await fetchMongoDBSchema(sequelize2, mongoDBName2);
  } else {
    schema2 = await fetchSchema(sequelize2, dbType2, dbName2, mongoDBName2);
  }

  console.log(schema2);

  res.json({ schema1, schema2 });
}

/**
 *
 * @param {takes sequelize,database type ,database name if database type is mongodb it takes mongodb database name} input
 * @returns {returns the schema for the given input}
 */

async function fetchSchema(sequelize, dbType, dbName, mongoDBName) {
  try {
    if (dbType === "mysql") {
      return fetchMySQLSchema(sequelize, dbName);
    } else if (dbType === "postgres") {
      return fetchPostgreSQLSchema(sequelize, dbName);
    } else if (dbType === "oracle") {
      return fetchOracleSchema(sequelize, dbName);
    } else if (dbType === "mongodb") {
      return await fetchMongoDBSchema(sequelize, mongoDBName);
    } else if (dbType === "sqlite") {
      return fetchSQLiteSchema(sequelize, dbName);
    } else {
      throw new Error("Unsupported database type");
    }
  } catch (err) {
    console.error("Error fetching schema:", err);
    return {};
  }
}

/**
 *
 * @param {takes the database type and table name as parameter} req
 * @param {returns the column names } res
 */
async function fetchTableDetails(req, res) {
  try {
    const { dbType, dbName, tableName } = req.body;

    let schema;
    if (dbType === "mongodb") {
      schema = schema1;
    } else {
      schema = dbType === "db1" ? schema1 : schema2;
    }

    let columns = schema[tableName];
    console.log(columns);
    res.json({ columns });
  } catch (error) {
    console.error("Error fetching table details:", error);
    res.send("Error fetching table details");
  }
}

/**
 *
 * @param {takes database type and query as the input} input
 * @returns {returns the data for the query}
 */

async function fetchData(dbType, query) {
  console.log(query);

  try {
    if (dbType === "mongodb") {
      return await executeMongoDBQuery(query);
    } else {
      return await executeSQLQuery(query);
    }
  } catch (error) {
    return "Invalid Query ";
  }
}

/**
 *
 * @param {takes SQL query as the input} input
 * @returns {returns the data for the SQL query}
 */

async function executeSQLQuery(query) {
  try {
    const [results] = await sequelize1.query(query);
    return results;
  } catch (error) {
    return;
  }
}

/**
 *
 * @param {takes mongodb query as input} input
 * @returns {returns the data for mongodb}
 */

async function executeMongoDBQuery(query) {
  try {
    const parts = query.split(".");
    const databaseName = parts.shift();
    const collectionName = parts.shift();
    const database = sequelize2.db.db(databaseName);
    const collection = database.collection(collectionName);

    const queryCommand = parts.join(".");

    const data = await eval(`collection.${queryCommand}`).toArray();

    return data;
  } catch (error) {
    return;
  }
}

module.exports = { connectToDB, fetchTableDetails, fetchData };
