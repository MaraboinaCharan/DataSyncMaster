const sqlite3 = require("sqlite3").verbose();

function mapDataType(databaseType,dataType) {
   
    const lowercaseDataType = dataType.toLowerCase();
    
    switch (databaseType) {

        case 'mysql':
            if (lowercaseDataType.includes('char')) {
                console.log("lowercasetype", lowercaseDataType);
                return 'String';
            } else if (lowercaseDataType.includes('int')) {
                return 'Integer';
            } else {
                switch (true) {
                    case lowercaseDataType.includes('varchar'):
                    case lowercaseDataType === 'text':
                        return 'string';
                    case lowercaseDataType === 'float'||'double'||'decimal':
                        return 'float';
                    case lowercaseDataType === 'date'||'datetime'||'timestamp':
                        return 'datetime';
                    default:
                        return 'unknown';
                }
            }
        case 'postgresql':
            if (lowercaseDataType.includes('char')) {
                return 'string';
            } else if (lowercaseDataType.includes('int')) {
                return 'integer';
            } else {
                switch (true) {
                    case lowercaseDataType.includes('character varying'):
                    case lowercaseDataType === 'text':
                        return 'string';
                    case lowercaseDataType === 'real'||'double precision'||'numeric':
                        return 'float';
                    case lowercaseDataType === 'date'||'timestamp':
                        return 'datetime';
                    default:
                        return 'unknown';
                }
            }
        case 'oracle':
            if (lowercaseDataType.includes('char')) {
                return 'string';
            } else if (lowercaseDataType.includes('int')) {
                return 'integer';
            } else {
                switch (true) {
                    case lowercaseDataType === 'varchar2'||'nvarchar2'||'clob':
                        return 'string';
                    case lowercaseDataType === 'number':
                        return 'integer';
                    case lowercaseDataType === 'float'||'binary_float'||'binary_double':
                        return 'float';
                    case lowercaseDataType === 'date'||'timestamp':
                        return 'datetime';
                    default:
                        return 'unknown';
                }
            }
        case 'mongodb':
            switch (true) {
                case lowercaseDataType === 'int' || 'long':
                    return 'integer';
                case lowercaseDataType === 'double':
                    return 'float';
                case lowercaseDataType === 'string'||'objectid'||'javascript':
                    return 'string';
                case lowercaseDataType === 'date':
                    return 'datetime';
                default:
                    return 'unknown';
            }
        case 'sqlite':
            switch (true) {
                case lowercaseDataType === 'integer':
                    return 'integer';
                case lowercaseDataType === 'real':
                    return 'float';
                case lowercaseDataType === 'text':
                    return 'string';
                case lowercaseDataType === 'datetime':
                    return 'datetime';
                default:
                    return 'unknown';
            }
        default:
            return 'unknown';
    }
}

async function fetchMySQLSchema(sequelize, dbName) {
    try {
       
      const [tables] = await sequelize.query(`SHOW TABLES FROM ${dbName}`);
      const tableNames = tables.map((table) => table[`Tables_in_${dbName}`]);
  
      const schema = {};
      for (const tableName of tableNames) {
        const [columns] = await sequelize.query(
          `SHOW COLUMNS FROM ${dbName}.${tableName}`
        );
        schema[tableName] = {};
        for (const column of columns) {
          schema[tableName][column.Field] = mapDataType('mysql',column.Type);
          console.log("column type",column.Type);
        }
      }
  
      console.log("MySQL schema fetched successfully");
      return schema;
    } catch (error) {
      console.error("Error fetching MySQL schema:", error);
      throw error;
    }
  }


async function fetchPostgreSQLSchema(sequelize, dbName) {
    try {
        const [tables] = await sequelize.query(`SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'`);
        const tableNames = tables.map((table) => table.table_name);

        const schema = {};
        for (const tableName of tableNames) {
            const [columns] = await sequelize.query(
                `SELECT column_name, data_type FROM information_schema.columns WHERE table_name='${tableName}'`
            );
            schema[tableName] = {};
            for (const column of columns) {
                schema[tableName][column.column_name] = mapDataType('postgresql', column.data_type);
            }
        }

        console.log("PostgreSQL schema fetched successfully");
        return schema;
    } catch (error) {
        console.error("Error fetching PostgreSQL schema:", error);
        throw error;
    }
}

async function fetchOracleSchema(sequelize, dbname) {
    try {
        const query = `
            SELECT table_name, column_name, data_type
            FROM all_tab_columns
            WHERE owner = '${dbname}'
        `;
        const result = await sequelize.query(query);

        const schema = {};
        result[0].forEach((row) => {
            const tableName = row.table_name;
            const columnName = row.column_name;
            const dataType = row.data_type;
            if (!schema[tableName]) {
                schema[tableName] = {};
            }
            schema[tableName][columnName] = mapDataType('oracle', dataType);
        });

        console.log("Oracle schema fetched successfully");
        return schema;
    } catch (error) {
        console.error("Error fetching Oracle schema:", error);
        throw error;
    }
}

async function fetchMongoDBSchema(client, dbName) {
    try {
        const database = client.db(dbName);
        const collections = await database.listCollections().toArray();

        const schema = {};
        for (const collection of collections) {
            const collectionName = collection.name;
            const collectionSchema = await database.collection(collectionName).findOne();
            schema[collectionName] = Object.keys(collectionSchema).reduce((acc, key) => {
                acc[key] = mapDataType('mongodb', typeof collectionSchema[key]);
                return acc;
            }, {});
        }

        console.log("MongoDB schema fetched successfully");
        return schema;
    } catch (error) {
        console.error("Error fetching MongoDB schema:", error);
        throw error;
    }
}

async function fetchSQLiteSchema(sequelize) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(
            "your_database.db",
            sqlite3.OPEN_READONLY,
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    const schema = {};
                    db.all(
                        "SELECT name FROM sqlite_master WHERE type='table'",
                        [],
                        (err, tables) => {
                            if (err) {
                                reject(err);
                                return;
                            }

                            const tableNames = tables.map((table) => table.name);
                            tableNames.forEach((tableName) => {
                                db.all(
                                    `PRAGMA table_info(${tableName})`,
                                    [],
                                    (err, columns) => {
                                        if (err) {
                                            reject(err);
                                            return;
                                        }
                                        schema[tableName] = columns.reduce((acc, column) => {
                                            acc[column.name] = mapDataType('sqlite', column.type);
                                            return acc;
                                        }, {});
                                        if (Object.keys(schema).length === tableNames.length) {
                                            resolve(schema);
                                        }
                                    }
                                );
                            });
                        }
                    );
                }
            }
        );
    });
}

module.exports = {
  fetchMongoDBSchema,
  fetchMySQLSchema,
  fetchOracleSchema,
  fetchPostgreSQLSchema,
  fetchSQLiteSchema,
};
