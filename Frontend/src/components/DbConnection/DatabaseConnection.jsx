import React, { useState } from "react";
import styles from './DbConnection.module.scss'
export default function DatabaseConnection({ id, onUpdate, setClicked }) {
    const [dbType, setDbType] = useState('');
    const [dbName, setDbName] = useState('');
    const [port, setPort] = useState('');
    const [host, setHost] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mongoURI, setMongoURI] = useState('');
    const [mongoDBName, setMongoDBName] = useState('');
    const [sqlitePath, setSqlitePath] = useState('');
    const [save, setSave] = useState(false);

    //function to handle the dbtype change
    const handleDbTypeChange = (event) => {
        const selectedDbType = event.target.value;
        //the selectedDbtype is stored in dbType
        setDbType(selectedDbType);
        setSave(true);
        setClicked(false);
    }

    //function when saved is clicked
    const afterFilling = (e) => {
        alert("database " + id + " details saved successfully")
        e.preventDefault();
        let data;

        //based on the dbtype, we assign the respective field values to "data"
        switch (dbType) {
            case 'mongodb':
                data = { dbType, mongoURI, mongoDBName };
                break;
            case 'sqlite':
                data = { dbType, sqlitePath };
                break;
            default:
                data = { dbType, dbName, host, port, username, password };
        }
        console.log(data, "data is")

        //This sends the id and the data to the DbConnection.jsx
        onUpdate(id, data);
        setClicked(true)
    }

    return (
        <div className={styles.main__container__dbbox} style={{fontFamily:'math'}}>
            {id=='1'?<h2 className={styles.main__container__dbbox__heading}>Source</h2>
            :<h2 className={styles.main__container__dbbox__heading}>Target</h2>}
            <select className={styles.inputFields} name={`dbType${id}`} id={`dbType${id}`} onChange={handleDbTypeChange}>
                <option value="" disabled selected>Select Database Type:</option>
                <option value="mysql">MySQL</option>
                <option value="postgres">PostgreSQL</option>
                <option value="sqlite">SQLite</option>
                <option value="oracle">Oracle</option>
                <option value="mongodb">MongoDB</option>
            </select><br /><br />
            <form onSubmit={afterFilling}>
                {dbType === 'mongodb' && (
                    <>
                        <input type="text" className={styles.inputFields} placeholder="MongoDB URI" id={`mongoURI${id}`} name={`mongoURI${id}`} value={mongoURI} onChange={(e) => setMongoURI(e.target.value)} required /><br /><br />
                        <input type="text" className={styles.inputFields} placeholder="MongoDB Database Name" id={`mongoDBName${id}`} name={`mongoDBName${id}`} value={mongoDBName} onChange={(e) => setMongoDBName(e.target.value)} required /><br /><br />
                    </>
                )}
                {dbType === 'sqlite' && (
                    <>
                        <input type="text" className={styles.inputFields} placeholder="SQLite Path" id={`sqlitePath${id}`} name={`sqlitePath${id}`} value={sqlitePath} onChange={(e) => setSqlitePath(e.target.value)} required /><br /><br />
                    </>
                )}
                {['mysql', 'postgres', 'oracle'].includes(dbType) && (
                    <div>
                        <input type="text" className={styles.inputFields} placeholder="Database Name" id={`dbName${id}`} name={`dbName${id}`} value={dbName} onChange={(e) => setDbName(e.target.value)} required /><br /><br />
                        <input type="text" className={styles.inputFields} placeholder="Host" id={`host${id}`} name={`host${id}`} value={host} onChange={(e) => setHost(e.target.value)} required /><br /><br />
                        <input type="text" className={styles.inputFields} placeholder="Port" id={`port${id}`} name={`port${id}`} value={port} onChange={(e) => setPort(e.target.value)} required /><br /><br />
                        <input type="text" className={styles.inputFields} placeholder="Username" id={`username${id}`} name={`username${id}`} value={username} onChange={(e) => setUsername(e.target.value)} required /><br /><br />
                        <input type="text" className={styles.inputFields} placeholder="Password" id={`password${id}`} name={`password${id}`} value={password} onChange={(e) => setPassword(e.target.value)} required /><br /><br />
                    </div>
                )}
                {save ? <input id={styles.afterFill} type="submit" value="save"></input> : <></>}
            </form>
        </div>
    );
};