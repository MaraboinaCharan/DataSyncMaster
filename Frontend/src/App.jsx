import './App.css';
import './styles/Common.scss'
import { BrowserRouter as Router, Route, Routes }
    from "react-router-dom";
import { createContext, useState } from 'react';
import { FileToDB } from './pages/FileToDB/FileToDB.jsx';
import { DashBoard } from './pages/DashBoard/DashBoard.jsx';
import { CSVtoCSV } from './pages/CSVtoCSV/CSVtoCSV.jsx';
import { FileToDBMapping } from './pages/FileToDBMapping/FileToDBMapping.jsx';
import DbConnection from './components/DbConnection/DbConnection.jsx'
import ErrorConnection from './common/ErrorConnection/ErrorConnection.jsx';
import TableDataComparision from './components/TableDataComparision/TableDataComparision.jsx';
import TableSchemaComparision from './components/TableSchemaComparision/TableSchemaComparision.jsx';
export const field = createContext(null);
function App() {
  
  const [dataOptions,setDataOptions]=useState(null);
  const [dbOptions,setDBOptions]=useState(null);
  const [currentStep,setStep]=useState(1);

  const [misMatches,setMisMatches]=useState([]);
  const [csvFields,setCSVFields]=useState({sourceHeaders:[],targetHeaders:[],status:'',sourceFile:'',targetFile:''})
  const [tableSchema,setTableSchema]=useState({});
  const [db1Type,setDb1Type]=useState('');
  const [db2Type,setDb2Type]=useState('');
  return (
    <>
    <field.Provider value={{dataOptions,setDataOptions,dbOptions,setDBOptions,misMatches,setMisMatches,
      csvFields,setCSVFields,tableSchema, setTableSchema, db1Type, setDb1Type, db2Type, setDb2Type,
      currentStep,setStep}}>
        <Router>
          <Routes>
            <Route path='/' element={<DashBoard/>}/>
            <Route path='/filetodb' element={<FileToDB/>}/>
            <Route path='/fieldmapping' element={<FileToDBMapping/>}/>
            <Route path='/csvtocsv' element={<CSVtoCSV/>}/>
            <Route path='/dbtodb' element={<DbConnection/>}/>
            <Route path='/schemaComparision' element={<TableDataComparision/>}/>
            <Route path='/dataComparision' element={<TableSchemaComparision/>}/>
            <Route path='/error' element={<ErrorConnection/>}/>
          </Routes>
        </Router>
        
    </field.Provider>   
    </>
  )
}
export default App