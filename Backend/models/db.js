const { Sequelize } = require("sequelize");
const { MongoClient } = require("mongodb");

async function connectToMySQL(dbName, username, password, host,type) {
 
    // console.log("jhih")
  let sequelize= new Sequelize(dbName, username, password, {
    host: host,
    dialect: "mysql",
  })
  try{
  await sequelize.authenticate();
  return sequelize;
}
catch(error)
{
  // console.error("Authentication Error:", error);
  // return res.status(500).json({ message: "Authentication Error" });
  throw new Error(`Invalid database credentials for ${type}`);
}

}

async function connectToPostgreSQL(dbName, username, password, host,type) {
 
    let sequelize=  new Sequelize(dbName, username, password, {
    host: host || "localhost",
    dialect: "postgres",
  })
  try {
  await sequelize.authenticate();
  return sequelize;
}
catch(error)
{
  // console.error("Authentication Error:", error);
  //   return res.status(500).json({ message: "Authentication Error" });
  // throw new Error("Invalid database credentials for ");
  throw new Error(`Invalid database credentials for ${type}`);



}
}

async function connectToSQLite(dbName,type) {
 
    let sequelize=  new Sequelize({
    dialect: "sqlite",
    storage: '"C:/Users/Charan/Desktop/sqlite3.db"',
  })
  try {
 await  sequelize.authenticate();
  return sequelize;
}
catch(error)
{
  // console.error("Authentication Error:", error);
  // return res.status(500).json({ message: "Authentication Error" });
  // throw new Error("Invalid database credentials for ");
  throw new Error(`Invalid database credentials for ${type}`);



}
}

async function connectToOracle(username, password, host, port,type) {

    let sequelize=  new Sequelize({
    username: username,
    password: password,
    dialect: "oracle",
    dialectOptions: { connectString: `${host}:${port}/orcl` },
  })
  try {
  await sequelize.authenticate();
  return sequelize;
}
catch(error)
{
  // console.error("Authentication Error:", error);
  // return res.status(500).json({ message: "Authentication Error" });
  // throw new Error("Invalid database credentials for ");
  throw new Error(`Invalid database credentials for ${type}`);



}
}

async function connectToMongoDB(mongoURI, dbName,type) {
  try {
    const client = new MongoClient(mongoURI);
    await client.connect().then(() => {
      // console.log("connected mongodb from connect");
    });

    return client;
  } catch (err) {
    // console.error("Authentication Error:", error);
    // return res.status(500).json({ message: "Authentication Error" });
    // throw new Error("Invalid database credentials for ");
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


