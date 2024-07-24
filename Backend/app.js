const express = require("express");
const bodyParser = require("body-parser");
const {
  connectToMySQL,
  connectToPostgreSQL,
  connectToOracle,
  connectToSQLite,
  connectToMongoDB,
} = require("./models/db");
const {
  fetchMongoDBSchema,
  fetchMySQLSchema,
  fetchOracleSchema,
  fetchPostgreSQLSchema,
  fetchSQLiteSchema,
} = require("./models/schema");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("Backend/views", express.static(path.join(__dirname, "views")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "Backend/views/index.html");
});

let sequelize1, sequelize2;
let schema1, schema2;

app.post("/connect", async (req, res) => {
  console.log(req.body);

  try {
    const {
      dbType1,
      dbName1,
      username1,
      password1,
      host1,
      port1,
      dbType2,
      dbName2,
      username2,
      password2,
      host2,
      port2,
      mongoURI2,
      mongoDBName2,
      mongoURI1,
      mongoDBName1,
    } = req.body;

    if (dbType1 === "mysql") {
      sequelize1 = connectToMySQL(dbName1, username1, password1, host1, port1);
      console.log("MySQL Database 1 Connected");
    } else if (dbType1 === "postgres") {
      sequelize1 = connectToPostgreSQL(
        dbName1,
        username1,
        password1,
        host1,
        port1
      );
      console.log("PostgreSQL Database 1 Connected");
    } else if (dbType1 === "sqlite") {
      sequelize1 = connectToSQLite(dbName1);
      console.log("SQLite Database 1 Connected");
    } else if (dbType1 === "oracle") {
      sequelize1 = connectToOracle(username1, password1, host1, port1);
      console.log("Oracle Database 1 Connected");
    } else if (dbType1 === "mongodb") {
      sequelize1 = await connectToMongoDB(mongoURI1, mongoDBName1);
      console.log("MongoDB Database Connected");
    } else {
      throw new Error("Invalid database type for database 1");
    }
    // console.log(await connectToSQLite());

    if (dbType2 === "mysql") {
      sequelize2 = connectToMySQL(dbName2, username2, password2, host2, port2);
      console.log("MySQL Database 2 Connected");
    } else if (dbType2 === "postgres") {
      sequelize2 = connectToPostgreSQL(
        dbName2,
        username2,
        password2,
        host2,
        port2
      );
      console.log("PostgreSQL Database 2 Connected");
    } else if (dbType2 === "sqlite") {
      sequelize2 = await connectToSQLite(dbName2);
      console.log("SQLite Database 2 Connected");
    } else if (dbType2 === "oracle") {
      sequelize2 = connectToOracle(username2, password2, host2, port2);
      console.log("Oracle Database 2 Connected");
    } else if (dbType2 === "mongodb") {
      sequelize2 = await connectToMongoDB(mongoURI2, mongoDBName2);
      console.log("MongoDB Database Connected");
    } else {
      throw new Error("Invalid database type for database 2");
    }

    // const [db1Schema, db1Data] =  fetchSchemaAndData(sequelize1, dbType1);
    // const [db2Schema, db2Data] =  fetchSchemaAndData(sequelize2, dbType2);

    // const schemaDiff = compareSchema(db1Schema,db2Schema);
    // const dataDiff = compareData(sequelize1, sequelize2, db1Schema, db2Schema);

    // res.json({ schemaDiff, dataDiff });

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

    const data1 = await fetchData(sequelize1, schema1, dbType1);
    const data2 = await fetchData(sequelize2, schema2, dbType2);

    // console.log(data1);
    // console.log(data2);

    res.redirect("/schema");
  } catch (err) {
    console.error("Error connecting to the dbs:", err);
    // res.status(500).send("Unable to connect to  dbs");
  }
});

app.get("/schema", (req, res) => {
  res.sendFile(__dirname + "Backend/views/schema.html");
});

app.get("/schemavalue", (req, res) => {
  console.log({ schema1, schema2 });

  res.json({ schema1, schema2 });
});

function fetchSchemaAndData(sequelize, dbType) {
  const schema = fetchSchema(sequelize, dbType);
  const data = fetchData(sequelize, schema);
  console.log(schema, data);

  return [schema, data];
}

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

async function fetchData(sequelize, schema, dbType) {
  try {
    // const dbType = sequelize.options.dialect;
    const tables = Object.keys(schema);
    // const tableNames = schema.map((tableName) => Object.keys(tableName)[0]);
    // console.log("tableNames",tableNames);
    // console.log("tables", tables)
    const data = {};

    if (
      dbType === "mysql" ||
      dbType === "postgres" ||
      dbType === "sqlite" ||
      dbType === "oracle"
    ) {
      for (const table of tables) {
        const [rows, fields] = await sequelize.query(`SELECT * FROM ${table}`);
        data[table] = rows;
      }
    } else if (dbType === "mongodb") {
      for (const table of tables) {
        const collection = sequelize.db.collection(table);
        const rows = await collection.find().toArray();
        data[table] = rows;
      }
    } else {
      throw new Error("Unsupported database type");
    }
    // console.log("Data fetched successfully", data);
    return data;
  } catch (err) {
    console.error("Error fetching data:", err);
    return {};
  }
}

app.post("/table-details", async (req, res) => {
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
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
