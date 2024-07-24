const {
  connectToMySQL,
  connectToPostgreSQL,
  connectToOracle,
  connectToSQLite,
  connectToMongoDB,
} = require("../models/db");

const {
  fetchMongoDBSchema,
  fetchMySQLSchema,
  fetchOracleSchema,
  fetchPostgreSQLSchema,
  fetchSQLiteSchema,
} = require("../models/schema");

//   const { fetchSchema } = require('../models/schema');

let sequelize1=null, sequelize2=null;
async function connectToDB(req, res) {
  console.log(req.body);

  //priyanka H changes
  // const {
  //   1: { dbType: dbType1, dbName: dbName1, mongoDBName: mongoDBName1, mongoURI: mongoURI1, username: username1, password: password1, host: host1, port: port1 },
  //   2: { dbType: dbType2, dbName: dbName2, username: username2, password: password2, host: host2, port: port2, mongoDBName: mongoDBName2, mongoURI: mongoURI2 }
  // } = req.body;

  // console.log(dbType1,dbType2,"from ");
  // const {

  //   1: {
  //     dbType: dbType1,
  //     dbName: dbName1,
  //     mongoDBName: mongoDBName1,
  //     mongoURI: mongoURI1,
  //     username: username1,
  //     password: password1,
  //     host: host1,
  //     port: port1
  //   },
  //   2: {
  //     dbType: dbType2,
  //     dbName: dbName2,
  //     username: username2,
  //     password: password2,
  //     host: host2,
  //     port: port2,
  //     mongoDBName: mongoDBName2,
  //     mongoURI: mongoURI2,
  //   }
  // } = req.body;

  // try {
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
 
    // if (dbType1 === "mysql") {
    //   sequelize1 = connectToMySQL(dbName1, username1, password1, host1, port1);
    
    //   // console.log("MySQL Database 1 Connected");
    // } else if (dbType1 === "postgres") {
    //   sequelize1 = connectToPostgreSQL(
    //     dbName1,
    //     username1,
    //     password1,
    //     host1,
    //     port1
    //   );
 
    //   // console.log("PostgreSQL Database 1 Connected");
    // } else if (dbType1 === "sqlite") {
    //   sequelize1 = connectToSQLite(dbName1);
  
    //   // console.log("SQLite Database 1 Connected");
    // } else if (dbType1 === "oracle") {
    //   sequelize1 = connectToOracle(username1, password1, host1, port1);
    
    //   // console.log("Oracle Database 1 Connected");
    // } else if (dbType1 === "mongodb") {
    //   sequelize1 = await connectToMongoDB(mongoURI1, mongoDBName1);
     
    //   // console.log("MongoDB Database Connected");
    // } else {
    //   // throw new Error("Invalid database type for database 1");
    //   res.status(500).send("Invalid database Credintials for database 1");
    //   return ;
    // }
   

    // if (dbType2 === "mysql") {
    //   sequelize2 = connectToMySQL(dbName2, username2, password2, host2, port2);
    //   // console.log("MySQL Database 2 Connected");
    
    // } else if (dbType2 === "postgres") {
    //   sequelize2 = connectToPostgreSQL(
    //     dbName2,
    //     username2,
    //     password2,
    //     host2,
    //     port2
    //   );
      
    //   // console.log("PostgreSQL Database 2 Connected");
    // } else if (dbType2 === "sqlite") {
    //   sequelize2 = await connectToSQLite(dbName2);
    
    //   // console.log("SQLite Database 2 Connected");
    // } else if (dbType2 === "oracle") {
    //   sequelize2 = connectToOracle(username2, password2, host2, port2);
    
    //   // console.log("Oracle Database 2 Connected");
    // } else if (dbType2 === "mongodb") {
    //   sequelize2 = await connectToMongoDB(mongoURI2, mongoDBName2);
      
    //   // console.log("MongoDB Database Connected");
    // } else {
    //   // throw new Error("Invalid database type for database 2");
    //   res.status(500).send("Invalid database Credintials for database 2");
     
    //   return;
    // }

    try {
      if (dbType1 === "mysql") {
        sequelize1 = await connectToMySQL(dbName1, username1, password1, host1, port1,"source");
      } else if (dbType1 === "postgres") {
        sequelize1 = await connectToPostgreSQL(dbName1, username1, password1, host1, port1,"source");
      } else if (dbType1 === "sqlite") {
        sequelize1 = await connectToSQLite(dbName1,"source");
      } else if (dbType1 === "oracle") {
        sequelize1 = await connectToOracle(username1, password1, host1, port1,"source");
      } else if (dbType1 === "mongodb") {
        sequelize1 = await connectToMongoDB(mongoURI1, mongoDBName1,"source");
      } 
      // if(sequelize1==null)
      // {
      //   return res.status(500).send("Invalid Credintials for Source");
      // }
      // if (error instanceof SequelizeErrors.ConnectionError && error.parent && error.parent.code === 'ER_BAD_DB_ERROR') {
      //   return res.status(500).send("Invalid credinatials for Source");
      // }

    } catch (error) {
      throw new Error("Invalid database credentials for Source");
      // if (error instanceof SequelizeErrors.ConnectionError && error.parent && error.parent.code === 'ER_BAD_DB_ERROR') {
      //   return res.status(500).send("Invalid credinatials for Source");
      // }

      // console.error("Invalid Credintials to database 1:", error);
      // return res.status(500).send("Invalid Credintials for Source");
    }

    // Connect to Database 2
    try {
      if (dbType2 === "mysql") {
        sequelize2 = await connectToMySQL(dbName2, username2, password2, host2, port2,"Target");
      } else if (dbType2 === "postgres") {
        sequelize2 = await connectToPostgreSQL(dbName2, username2, password2, host2, port2,"Target");
      } else if (dbType2 === "sqlite") {
        sequelize2 = await connectToSQLite(dbName2,"Target");
      } else if (dbType2 === "oracle") {
        sequelize2 = await connectToOracle(username2, password2, host2, port2,"Target");
      } else if (dbType2 === "mongodb") {
        sequelize2 = await connectToMongoDB(mongoURI2, mongoDBName2,"Target");
      } 
      // if(sequelize2==null)
      // {
      //   return res.status(500).send("Invalid Credintials for Target");
      // }
      // if (error instanceof SequelizeErrors.ConnectionError && error.parent && error.parent.code === 'ER_BAD_DB_ERROR') {
      //   return res.status(500).send("Invalid credinatials for Source");
      // }
    } catch (error) {
      // if (error instanceof SequelizeErrors.ConnectionError && error.parent && error.parent.code === 'ER_BAD_DB_ERROR') {
      //   return res.status(500).send("Invalid Credinatials for Target");
      // }

      // console.error("Error connecting to database 2:", error);
      // return res.status(500).send("Invalid Credintials for Target");
      throw new Error("Invalid database credentials for Target");
    }

    // Once both connections are successful, proceed with further logic
    // sequelize1.dbType = dbType1; 
    // sequelize2.dbType = dbType2; 

    // 

      sequelize1.dbType = dbType1; 
    sequelize2.dbType = dbType2; 

    if (dbType1 === "mongodb") {
      schema1 = await fetchMongoDBSchema(sequelize1, mongoDBName1);
    } else {
      schema1 = await fetchSchema(sequelize1, dbType1, dbName1, mongoDBName1);
    }

    // console.log(schema1);

    if (dbType2 === "mongodb") {
      schema2 = await fetchMongoDBSchema(sequelize2, mongoDBName2);
    } else {
      schema2 = await fetchSchema(sequelize2, dbType2, dbName2, mongoDBName2);
    }
 
    // if(!schema1&&!schema2)
    // {
    //   return res.status(500).send("Invalid Credinatials for Soruce and Target");
    // }
    // if(!schema1)
    // {
    //   return res.status(500).send("Invalid Credinatials for Source");
    // }
    // if(!schema2)
    // {
    //   return res.status(500).send("Invalid Credinatials for Target");
    // }

    res.redirect("/schema");
  
    // res.sendFile(__dirname + 'DBcheck - Copy/views/schema.html');
  // } catch (err) {
  //   // console.error("Error connecting to the dbs:", err);
  //   // res.send("Invalid credinatials for databases");
  //   throw new Error("Invalid database credentials ");

  // }
 
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
    // console.log(columns);
    res.json({ columns });
  } catch (error) {
    console.error("Error fetching table details:", error);
    res.status(500).json({ error: "Unable to fetch data" });
  }
}


async function fetchData(dbType, query) {
  console.log(query);
 
  try {
   
    if (dbType === "mongodb") {
      return await executeMongoDBQuery(query);
    } else {
      return await executeSQLQuery(query);
    }
  } catch (error) {
    
      return "Invalid Query";
    
}
}

async function executeSQLQuery(query) {
  try {

    // console.log(query,"from executesqlquery");
    const [results] = await sequelize1.query(query);
    return results;
  } catch (error) {
    return ;
    // console.error("Error executing SQL query:", error);
    // throw error;
  }
}

async function executeMongoDBQuery(query) {
  try {
    const databaseName = parts.shift(); 
    const collectionName = parts.shift(); 
    const database = sequelize2.db.db(databaseName); 
    const collection = database.collection(collectionName); 

  
    const queryCommand = parts.join('.');
   
    const data = await eval(`collection.${queryCommand}`).toArray(); 

    return data;
  } catch (error) {
    return 
    // console.error("Error executing MongoDB query:", error);
    // throw error;
  }
}

// async function executeMongoDBQuery(query) {
//   try {
  
//     const database = sequelize2.db;
//     const collectionName = query.split(" ").slice(-1)[0];
//     const collection = database.collection(collectionName);
//     const data = await collection.find().toArray();
//     return data;
//   } catch (error) {
//     console.error("Error executing MongoDB query:", error);
//     throw error;
//   }
// }




module.exports = { connectToDB, fetchData, fetchTableDetails };
