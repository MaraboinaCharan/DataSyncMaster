import Header from "../../components/Header/header";
import FeildMapping from "../../components/FeildMapping/FeildMapping";
import { field } from '../../App';
import { useContext } from "react";
export const FileToDBMapping=()=>{
    const {dataOptions,dbOptions}=useContext(field)
    return(
        <>
            <Header title={"File to DB Testing"} route={"filetodb"}/>
            <FeildMapping  dataOptions={dataOptions} dbOptions={dbOptions} type={"filetodb"}/>
        </>
    );
}