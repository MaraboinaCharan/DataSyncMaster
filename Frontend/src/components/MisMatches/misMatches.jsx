/* eslint-disable react/prop-types */

import { field } from '../../App';
import { useEffect, useState } from 'react';
import {useContext} from 'react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// const columns = [

//   { field: 'id', headerName: 'ID', width: 90 },
//   {
//     field: 'firstName',
//     headerName: 'First name',
//     width: 150,
//     editable: true,
//   },
//   {
//     field: 'lastName',
//     headerName: 'Last name',
//     width: 150,
//     editable: true,
//   },
//   {
//     field: 'age',
//     headerName: 'Age',
//     type: 'number',
//     width: 110,
//     editable: true,
//   },
//   {
//     field: 'fullName',
//     headerName: 'Full name',
//     description: 'This column has a value getter and is not sortable.',
//     sortable: false,
//     width: 160,
//   },
// ];


export default function MisMatches({dbOptions}) {
  const { misMatches } = useContext(field);
  const [column,setColumns]=useState([]);
  useEffect(()=>{
    setColumns(allColumns());
  },[dbOptions])
  const allColumns = () => {
    return dbOptions.map(each => ({
      field: each,
      headerName: each,
      width: 160,
    }))
  };
  console.log(misMatches)
  console.log(dbOptions)
  return (
    <>
    <h1 className='heading'>Mismatches</h1>
   
    <Box sx={{ margin: '0px 40px 0px 40px'}}>

      {misMatches.length>0?<DataGrid 
        rows={misMatches}
        columns={column}
        pageSize={5}
        getRowId={(row) => row[dbOptions[0]]} 
        checkboxSelection
        disableSelectionOnClick
       
      />:
      <p>All Records Matched</p>}
    </Box>
    </>
  );
}



