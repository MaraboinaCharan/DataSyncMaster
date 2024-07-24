/* eslint-disable no-prototype-builtins */
import { useContext, useState, useEffect } from "react";
import styles from "./TableDataComparision.module.scss";
import { field } from "../../App";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import HomeIcon from '@mui/icons-material/Home';
import GetAppIcon from '@mui/icons-material/GetApp';
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function TableDataComparision() {
  const navigate = useNavigate();
  //To get the globally stored table Schema
  const { tableSchema } = useContext(field);

  //to set the selectedTable from database1s
  const [selectedTable1, setSelectedTable1] = useState("");
  
  //to set the selectedTable from database2
  const [selectedTable2, setSelectedTable2] = useState("");

  //to set the schema details of selectedTable from database1
  const [schemaDetails1, setSchemaDetails1] = useState(null);

  //to set the schema details of selectedTable from database2
  const [schemaDetails2, setSchemaDetails2] = useState(null);

  //to set the table1 schema differences with table2
  const [highlightedRows1, setHighlightedRows1] = useState([]);

  //to set the table2 schema differences with table1
  const [highlightedRows2, setHighlightedRows2] = useState([]);

  //Function to store highlighted rows
  //highlighted --> this defines which highlighted array to be used
  //columnName --> to store the columnname
  //datatype --> to store the corresponding datatype of the columnname
  const client = axios.create({
    baseURL: "http://localhost:8084",
  });
  const storeHighlightedRows = (highlighted, columnName, dataType) => {
    highlighted.push({ columnName, dataType });
  };

  useEffect(() => {
    if (selectedTable1 && tableSchema.schema1) {
      const tableDetails1 = tableSchema.schema1[selectedTable1];
      setSchemaDetails1(tableDetails1);
    }
  }, [selectedTable1, tableSchema]);

  useEffect(() => {
    if (selectedTable2 && tableSchema.schema2) {
      const tableDetails2 = tableSchema.schema2[selectedTable2];
      setSchemaDetails2(tableDetails2);
    }
  }, [selectedTable2, tableSchema]);


  //to set the highlighted rows, whenever a change occurs in selected tablename in both database1 and database2
  // useEffect(() => {
  //   if (schemaDetails1 && schemaDetails2) {
  //     const highlighted1 = [];
  //     const highlighted2 = [];
  
  //     // Compare schemaDetails1 with schemaDetails2
  //     Object.entries(schemaDetails1).forEach(([columnName, dataType]) => {
  //       if (schemaDetails2[columnName] !== dataType) {
  //         storeHighlightedRows(highlighted1, columnName, dataType);
  //         storeHighlightedRows(highlighted2, columnName, dataType);
  //       }
  //     });
  //     console.log(schemaDetails2,"schemaDetails2")
  
  //     // Filter out rows that are only in the target database
  //     Object.entries(schemaDetails2).forEach(([columnName, dataType]) => {
  //       if (!schemaDetails1.hasOwnProperty(columnName)) {
  //         storeHighlightedRows(highlighted2, columnName, dataType);
  //       }
  //     });
  
  //     setHighlightedRows1(highlighted1);
  //     setHighlightedRows2(highlighted2);

  //     console.log(highlighted1);
  //     console.log(highlighted2);
  //   }
  // }, [schemaDetails1, schemaDetails2]);
  

  useEffect(() => {
    if (schemaDetails1 && schemaDetails2) {
      const highlighted1 = [];
      const highlighted2 = [];
  
      // Compare schemaDetails1 with schemaDetails2
      Object.entries(schemaDetails1).forEach(([columnName, columnDetails]) => {
        if (!schemaDetails2.hasOwnProperty(columnName) || schemaDetails2[columnName].type !== columnDetails.type || schemaDetails2[columnName].primaryKey !== columnDetails.primaryKey) {
          storeHighlightedRows(highlighted1, columnName, columnDetails.type);
        }
      });
  
      // Compare schemaDetails2 with schemaDetails1
      Object.entries(schemaDetails2).forEach(([columnName, columnDetails]) => {
        if (!schemaDetails1.hasOwnProperty(columnName) || schemaDetails1[columnName].type !== columnDetails.type || schemaDetails1[columnName].primaryKey !== columnDetails.primaryKey) {
          storeHighlightedRows(highlighted2, columnName, columnDetails.type);
        }
      });
  
      setHighlightedRows1(highlighted1);
      setHighlightedRows2(highlighted2);
    }
  }, [schemaDetails1, schemaDetails2]);
  

  
  const handleDownload=async()=>{
    try {
      const resp = await client.post('/schemadownload',schemaDetails1);
      console.log(resp);
      const blob = new Blob([resp.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }
  return (
    <div className={styles.schemaCompare}>
      <div className={styles.schemaCompare__iconsDiv}>
        <KeyboardBackspaceIcon onClick={()=>navigate('/dbtodb')}/>
        <div className={styles.schemaCompare__iconsDiv__rightIcons}>
          <GetAppIcon onClick={()=>handleDownload()}/>
          <HomeIcon/>
        </div>
      </div>
      <div className={styles.schemaCompare__upper}>
        <h1 className={styles.schemaCompare__upper__heading}>Tables Schema Comparision</h1>
        <button className={styles.schemaCompare__upper__button} onClick={()=>navigate('/dataComparision')}>
          Table Data
        </button>
      </div>
      <p className={styles.schemaCompare__subheading}>
        Please select the table names to get differences in table schemas!
      </p>
      <div className={styles.schemaCompare__container}>
        <div className={styles.schemaCompare__container__dbbox}>
          <h2 className={styles.schemaCompare__container__dbbox__subheading}>
            Source
          </h2>
          <select
            className={styles.inputSelect}
            onChange={(event) => setSelectedTable1(event.target.value)}
            value={selectedTable1}
          >
            <option className={styles.inputText} value="">
              Select Table
            </option>
            {tableSchema.schema1 &&
              Object.keys(tableSchema.schema1).map((tableName, index) => (
                <option
                  className={styles.inputText}
                  key={index}
                  value={tableName}
                >
                  {tableName}
                </option>
              ))}
          </select>
          {schemaDetails1 && (
            <div className={styles.schemaDetails}>
              <h3>Schema Details for {selectedTable1}:</h3>
              <table className={styles.table}>
                <tbody>
                  <tr style={{ color: "black", fontWeight: "bold" }}>
                    <td>Column names</td>
                    <td>Data types</td>
                  </tr>
                  {/* {Object.entries(schemaDetails1).map(([columnName, dataType]) => (
                    <tr
                      key={columnName}
                      className={
                        highlightedRows1.find(row => row.columnName === columnName) ? styles.redRow : ""
                      }
                    >
                      <td>{columnName}</td>
                      <td>{dataType}</td>
                    </tr>
                  ))} */}
                  {Object.entries(schemaDetails1).map(([columnName, columnDetails]) => (
  <tr
    key={columnName}
    className={
      highlightedRows1.find(row => row.columnName === columnName) ? styles.redRow : ""
    }
  >
    <td>{`${columnName}${columnDetails.primaryKey ? " (Primary Key)" : ""}`}</td>
    <td>{columnDetails.type}</td>
  </tr>
))}

                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className={styles.schemaCompare__container__dbbox}>
          <h2 className={styles.schemaCompare__container__dbbox__subheading}>
            Target
          </h2>
          <select
            className={styles.inputSelect}
            onChange={(event) => setSelectedTable2(event.target.value)}
            value={selectedTable2}
          >
            <option value="" className={styles.inputText}>
              Select Table
            </option>
            {tableSchema.schema2 &&
              Object.keys(tableSchema.schema2).map((tableName, index) => (
                <option
                  className={styles.inputText}
                  key={index}
                  value={tableName}
                >
                  {tableName}
                </option>
              ))}
          </select>
          {schemaDetails2 && (
            <div className={styles.schemaDetails}>
              <h3>Schema Details for {selectedTable2}:</h3>
              <table className={styles.table}>
                <tbody>
                  <tr style={{ color: "black", fontWeight: "bold" }}>
                    <td>Column names</td>
                    <td>Data types</td>
                  </tr>
                  
                  {/* {Object.entries(schemaDetails2).map(([columnName, dataType]) => (
                    <tr
                      key={columnName}
                      className={
                      highlightedRows2.find(row => row.columnName === columnName) ? styles.redRow : ""
                      }
                    >
                      <td>{columnName}</td>
                      <td>{dataType}</td>
                    </tr>
                  ))} } */}
                  {Object.entries(schemaDetails2).map(([columnName, columnDetails]) => (
  <tr
    key={columnName}
    className={
      highlightedRows2.find(row => row.columnName === columnName) ? styles.redRow : ""
    }
  >
    <td>{`${columnName}${columnDetails.primaryKey ? " (Primary Key)" : ""}`}</td>
    <td>{columnDetails.type}</td>
  </tr>
))}

                  </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
