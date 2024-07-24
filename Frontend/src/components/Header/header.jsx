/* eslint-disable react/prop-types */
import styles from './header.module.scss';
import GetAppIcon from '@mui/icons-material/GetApp';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from "react-router-dom";
import { field } from "../../App";
import { useContext } from 'react';
import { request } from '../../services/Axios/calls';
export default function Header({title,route}){
const Navigate = useNavigate();
const {misMatches } =
useContext(field);
    const downLoad=async()=>{
        try {
          const resp = await request("GET","downloadfile");
          console.log(resp)
          const blob = await resp.blob();
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
    return(
        <>
            <div className={styles.header}>
                <p className={styles.header__text}>{title}</p>
            </div>
            <div className="icons">
                <KeyboardBackspaceIcon onClick={() => Navigate(`/${route}`)}/>
            <div>
            {misMatches.length > 0 ? <GetAppIcon onClick={()=>downLoad()}/>:<></>}
            <HomeIcon onClick={() => Navigate("/")}/>
            </div>
        </div>
      </>
    )
}