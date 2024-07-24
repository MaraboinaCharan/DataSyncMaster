import {useContext, useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import TextField from '@mui/material/TextField';
import styles from './Form.module.scss';
import fileImage from '../../assets/upload.svg'
import {request} from '../../services/Axios/calls.js';
import { field } from '../../App.jsx';
import { useNavigate } from 'react-router-dom';
export const Form=()=>{
    const {setDataOptions,setDBOptions}=useContext(field)
    const Navigate=useNavigate();
    const form=useForm({mode:"onBlur"});
    const fileform=useForm({mode:'onBlur'})
    const { register: registerForm1, handleSubmit: handleSubmitForm1, formState: formStateForm1 } = form;
    const { errors: errorsForm1 } = formStateForm1;
    const { register: registerForm2, handleSubmit: handleSubmitForm2, formState: formStateForm2} = fileform;
    const { errors: errorsForm2 } = formStateForm2;
    const [isSubmit,setSubmit]=useState('')
    const [file,setFile]=useState();
    const [fileStatus,setfileStatus]=useState('');
   
    const [column, setColMsg]=useState('');
    const checkColumn=async()=>{
      const response=await request('GET','initialfiletodbcompare');
        setColMsg(response.message);
        setDataOptions(response.header1)
        setDBOptions(response.header2)
        console.log(response,"as res")
   }
   useEffect(()=>{
    if(isSubmit=='Database connected' && fileStatus=='File submitted successfully'){
      checkColumn()
    }
   },[isSubmit,fileStatus])

   useEffect(()=>{
    setTimeout(async()=>{
      if(column=='column lengths are matched')
        Navigate("/fieldmapping")
        },2000)
  
   },[column])
    const setDatabaseData=async(formdata)=>{
      try{
      let data = {
        host:formdata.Host,
        databaseName: formdata.DatabaseName,
        userName: formdata.UserName,
        password: formdata.Password,
        databaseType: formdata.DatabaseType,
        tableName: formdata.TableName,
        port:formdata.port,
      };
    const data1=await request("POST","databaseconnection",data)
    setSubmit(data1.message)
    console.log(isSubmit,"submitform");
    console.log(fileStatus=='File submitted successfully');
   
  }

    // resetForm();
    catch(e){
      console.log(e)
    }
}
const upload = async(file) => {
  const formData = new FormData();
  formData.append("file", file);
  const fileUpload=await request("POST","file",formData)
  console.log(fileUpload,"post")
  setfileStatus(fileUpload.message)
  
};
const setFormData=async(data)=>{
  let filename = data.Filename[0].name;
  console.log(filename,"as file name")
  
  upload(data.Filename[0]);
  // setfileStatus(true);
  // setTimeout(async()=>{
  // console.log(isSubmit,fileStatus)

  //     if(isSubmit=='Database connected'&& fileStatus=='File submitted successfully'){
  //       await checkColumn();
        
  //       Navigate("/fieldmapping")
  //     }
  //       },2000)
      
      
      // resetFlie();

}
const showfile=(file,setFile)=>{
  let a=document.getElementById('fileInput');
  setFile(a.files[0].name)
}

  return (
    <>
 
    <div className={styles.container}>
   
        
        
        <form onSubmit={handleSubmitForm2(setFormData)} className={styles.container__fileForm}>
          <label htmlFor="fileInput" className={styles.fileStyles}>
            <div>
              <img src={fileImage} alt="upload" />
            </div>
            <p  className={styles.content}>
              <span>Select</span> a file Formats: CSV & XLSX.
            </p>
          </label>
        <input type="file" id="fileInput" className={styles.fileInput} {...registerForm2("Filename",{required:"*File is Mandatory Field"})} onInput={()=>showfile(file,setFile)}/>
        {file?
        <>
          <p className={styles.content}>{file}</p>
          <button type="submit" className={styles.button}>Upload File</button>
        </>:
        <></>
        }
        <p className={styles.errorMessage}>{errorsForm2.Filename?.message}</p> 
        <p>{fileStatus}</p>
        {/* {fileStatus && file? <p className="successMessage">file Submitted Successfully</p>:<p className={styles.error}></p>} */}
      </form>


      <form onSubmit={handleSubmitForm1(setDatabaseData)} className={styles.container__form}>
            <div className={styles.inputFieldConatiner}>
            <TextField id="standard-basic" label="DatabaseType" variant="standard" className={styles.inputField} {...registerForm1("DatabaseType",{required:"*databasetype is Mandatory Field"})}/>
            <p className={styles.errorMessage}>{errorsForm1.DatabaseType?.message}</p>
            </div>

            <div className={styles.inputFieldConatiner}>
            <TextField id="standard-basic" label="Host" variant="standard" className={styles.inputField} {...registerForm1("Host",{required:"*Host is Mandatory Field"})}/>
            <p className={styles.errorMessage}>{errorsForm1.Host?.message}</p>
            </div>

            <div className={styles.inputFieldConatiner}>
            <TextField id="standard-basic" label="DatabaseName" variant="standard" className={styles.inputField}  {...registerForm1("DatabaseName",{required:"*databasename is Mandatory Field"})}/>
            <p className={styles.errorMessage}>{errorsForm1.DatabaseName?.message}</p>
            </div>
            <div className={styles.inputFieldConatiner}>
            <TextField id="standard-basic" label="port" variant="standard" className={styles.inputField}  {...registerForm1("port",{required:"*portnumber is Mandatory Field"})}/>
            <p className={styles.errorMessage}>{errorsForm1.port?.message}</p>
            </div>
            <div className={styles.inputFieldConatiner}>
            <TextField id="standard-basic" label="UserName" variant="standard" className={styles.inputField} {...registerForm1("UserName",{required:"*username is Mandatory Field"})}/>            <p className={styles.errorMessage}>{errorsForm1.UserName?.message}</p>
            </div>
            <div className={styles.inputFieldConatiner}>
            <TextField id="standard-basic" label="Password" variant="standard" className={styles.inputField} {...registerForm1("Password",{required:"*password is Mandatory Field"})}/>
            <p className={styles.errorMessage}>{errorsForm1.Password?.message}</p>
            </div>
            <div className={styles.inputFieldConatiner}>
            <TextField id="standard-basic" label="TableName" variant="standard" className={styles.inputField} {...registerForm1("TableName",{required:"*tablename is Mandatory Field"})}/>
            <p className={styles.errorMessage}>{errorsForm1.TableName?.message}</p>
            </div>
            <button type='submit' className={styles.button}>Submit</button>
           {isSubmit? <p>{isSubmit}</p>:<></>}
        </form>
      {/* </Box> */}
      {/* </Modal> */}


    </div>
    <p className='successMessage'>{column}</p>

  </>
  )
}
