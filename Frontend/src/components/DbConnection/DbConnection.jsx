import { useState, useContext } from "react";
import styles from './DbConnection.module.scss';
import DatabaseConnection from "./DatabaseConnection";
import { useNavigate } from "react-router-dom";
import { field } from '../../App';
import axios from "axios";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Modal } from "@mui/material";

export default function DbConnection() {
    
    //setDb1type -> to globally store the selected database1 type
    //setDb2type -> to globally store the selected database2 type
    //setTableSchema -> to globally store the response from the submit post API call
    const { tableSchema, setTableSchema, setDb1Type, setDb2Type } = useContext(field);
    const Navigate = useNavigate();
    //to set the form data
    const [formData, setFormData] = useState({}); 

    //set to true when database1 details are saved, passed as props to databaseConnection.jsx
    const [isClicked1, setClicked1] = useState();

    //set to true when database2 details are saved, passed as props to databaseConnection.jsx
    const [isClicked2, setClicked2] = useState(); 

    //set to true when data is not recieved on submiting the form, to display error message
    const [error, setError] = useState(null);
    
    //To update the form values
    const handleUpdate = (id, data) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [id]: { ...data }
        }));
    };
    const client = axios.create({
        baseURL: "http://172.22.31.50:8084/connect",
    });

    //Function to submit the form values, try catch block to handle the response from the submit post call
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(formData).length !== 0) {
            try {
                const data1 = await client.post('/', formData);
                if (data1) {
                    setTableSchema(data1.data);
                    setDb1Type(formData[1].dbType);
                    setDb2Type(formData[2].dbType);
                    if (tableSchema) Navigate('/schemaComparision');
                    console.log("Data received:", data1.data);
                } else {
                    console.log("No data received from server");
                }
            } catch (error) {
                console.error("Error occurreddd:", error.response.data);
                    setError(error.response.data);
            }
        }
    };
    return (    
        <div className={styles.main}>
            <KeyboardBackspaceIcon className={styles.main__back} onClick={()=>Navigate('/')}/>
            <h1 className={styles.main__heading}>Database Connection</h1>
            <p className={styles.main__subheading}>Please enter the below details to establish database connection!</p>
            <div className={styles.main__container}>
                <DatabaseConnection id={1} onUpdate={handleUpdate} setClicked={setClicked1}/>
                <DatabaseConnection id={2} onUpdate={handleUpdate} setClicked={setClicked2}/>
            </div>
            <br/>
            {isClicked1 && isClicked2 ? <input id={styles.submit} type="submit" value="Connect" onClick={handleSubmit}/> : null}
            <Modal open={!!error} onClick={() => setError(null)}>
            <div className={styles.modal}>
                    <div className={styles.modal__content}>{error}</div>
                </div>
            </Modal>
        </div>
    ); 
}
