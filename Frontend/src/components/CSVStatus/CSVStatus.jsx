import { useContext } from "react"
import { field } from "../../App"
import styles from './CSVStatus.module.scss'
export const CSVStatus=()=>{
    const {csvFields}=useContext(field);

    return(
        <div className={styles.container}>
            <div>Columns Length :</div>
            <div>{csvFields.status}</div>
        </div>
    )
}