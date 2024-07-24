/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import styles from "./TableSchemaComparision.module.scss";
import axios from "axios";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import HomeIcon from '@mui/icons-material/Home';
import GetAppIcon from '@mui/icons-material/GetApp';
import { field } from "../../App";
import { useNavigate } from "react-router-dom";
function TableSchemaComparision() {
  const navigate = useNavigate();
  const client = axios.create({
    baseURL: "http://localhost:8084",
  });
  const { db1Type, db2Type } = useContext(field);
  const [db1Query, setDb1Query] = useState('');
  const [db2Query, setDb2Query] = useState('');
  const [caseSensitivity, setCaseSensitivity] = useState(false);
  const [tableData, setTableData] = useState([]);
  const handleSubmit = async (e) => {
     
    e.preventDefault();
    const formData = {
      db1Query: db1Query,
      db2Query: db2Query, 
      db1Type: db1Type,
      db2Type: db2Type,
      caseSensitive: caseSensitivity,
    };

    console.log(formData,"su");
    try {
      const data1 = await client.post("/compareData", formData);
      console.log(data1,"data")
      if (data1) {
        setTableData(data1.data);
        console.log(data1,"from tabledata");
      } else {
        console.log("No data received from server");
      }
    } catch (error) {
      console.error("Error occurred:", error.message);
      if (error.response) {
        navigate("/error");
        // You can access the error message from error.response.data and handle it as needed
      }
    }
  };
  const exportSub=async()=>{
    try{
      const resp = await client.post("/schemadownload",tableData);
      console.log(resp);
      const blob = new Blob([resp.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    }catch(error){
      console.log(error)
    }
  }
  return (
    <div className={styles.dataCompare}>
      <div className={styles.dataCompare__iconsDiv}>
        <KeyboardBackspaceIcon onClick={()=>navigate('/schemaComparision')}/>
        <div className={styles.dataCompare__iconsDiv__rightIcons}>
          <GetAppIcon onClick={exportSub}/>
          <HomeIcon/>
          </div>
      </div>
      <h1 className={styles.dataCompare__heading}>Tables Data Comparision</h1>
      <p className={styles.dataCompare__subheading}>
        Please enter the below details to to get differences in table datas!
      </p>
      <form>
        <div className={styles.dataCompare__container}>
          <div className={styles.dataCompare__container__dbbox}>
            <h2 className={styles.dataCompare__container__dbbox__heading}>
              Source
            </h2>
            <textarea
              required
              className={styles.dataCompare__container__dbbox__dbtable}
              placeholder="Enter table details"
              rows="10"
              cols="50"
              value={db1Query}
              onChange={(e) => setDb1Query(e.target.value)}
            ></textarea>
          </div>
          <div className={styles.dataCompare__container__dbbox}>
            <h2 className={styles.dataCompare__container__dbbox__heading}>
              Target
            </h2>
            <textarea
              required
              className={styles.dataCompare__container__dbbox__dbtable}
              placeholder="Enter table details"
              rows="10"
              cols="50"
              value={db2Query}
              onChange={(e) => setDb2Query(e.target.value)}
            ></textarea>
          </div>
        </div>
        <input
          type="checkbox"
          className={styles.dataCompare__checkbox}
          onClick={() => setCaseSensitivity(!caseSensitivity)}
        />
        Please check for enabling Case Sensitivity
        <input
          type="submit"
          value="Submit"
          className={styles.dataCompare__submit}
          onClick={handleSubmit}
        />
      </form>
      {tableData!=""?
      <>
      <h1 className={styles.dataCompare__heading2}>Table Rows Mismatched In Target Database</h1>
      <div className={styles.dataCompare__tableDiv}>
        <table className={styles.dataCompare__tableDiv__table}>
          <thead>
            <tr>
              {tableData.length > 0 &&
                Object.keys(tableData[0]).map((key) => (
                  <th key={key}>{key.toUpperCase()}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(tableData)?
            <>
              {
              
              tableData.map((row, index) => (
                <tr key={index}>
                  {Object.keys(row).map((key) => (
                    <td key={key}>{row[key]}</td>
                  ))}
                </tr>
              ))}
            </>:
            <>Invalid Queries</>}
          </tbody>
        </table>
        
      </div></>:<></>}
    </div>
  );
}

export default TableSchemaComparision;
