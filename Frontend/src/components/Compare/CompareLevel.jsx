/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { useContext, useRef, useState } from 'react';
import styles from './CompareLevel.module.scss';
import FeildMapping from '../FeildMapping/FeildMapping';
import { request } from '../../services/Axios/calls';
import { field } from '../../App';
export default function compareLevel1(){
    const {dataOptions}=useContext(field);
    return(
        <div className={styles.level}>
                {dataOptions?<FeildMapping/>:
                <></>
                }
        </div>
    )
}