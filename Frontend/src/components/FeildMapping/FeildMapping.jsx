/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
import { useState, useContext} from "react";
import styles from "./FeildMapping.module.scss";
import { request } from "../../services/Axios/calls";
import { field } from "../../App";
import MisMatches from "../MisMatches/misMatches";

export default function FeildMapping({dataOptions,dbOptions,type}) {
  const {setMisMatches, misMatches } = useContext(field);
  const minLength=Math.min(dataOptions.length,dbOptions.length)

  const emptyFeilds = new Array(minLength);

  emptyFeilds.fill("Drop Here");
  const [val, setVal] = useState(emptyFeilds);
  const [ind, setInd] = useState({

    });
  const [isSelected, setSelected] = useState(false);
  const [msg,setmsg]=useState();
  // useEffect(()=>{
  //     setVal(val.filter(item => item !== 'Drop Here'))
  // },[msg])
  var feild1 = 0;
  var feild2 = 0;
  const dropOptions = (index) => {
    feild2 = index;
    setInd(() => ({ ...ind, [feild1]: feild2 }));
    const updatedDbFeilds = [...val];
    updatedDbFeilds[index] = dataOptions[feild1];
    setVal(updatedDbFeilds);
  };
  const compare = async (eve) => {
    eve.preventDefault();

    let values = Object.values(ind);
    let keys=Object.keys(ind)
    for(let i=0;i<keys.length;i++)
    {
      keys[i]=Number(keys[i])
    }
    console.log(values,keys,"keyvalues");
    if ((dataOptions.length==dbOptions.length) && (values.length == dataOptions.length) && type=="filetodb") {
      const res = await request(
        "POST",
        "filetodbcompare",
        values
      );
      setMisMatches(res.LostData);
      setmsg(res.message)
      console.log(res);
    }
    else if(((dataOptions.length==dbOptions.length) && (values.length == minLength) && type=="csvtocsv")||
            ((values.length <= minLength) && type=="csvtocsv"))
    {
      handleCSV([values,keys]);

    }
    else{
      console.log("Map items correctly",dataOptions.length,dbOptions.length,values.length,minLength,type)
    }
  };
  
  const handleCSV=async(payload)=>{
    let data= await request("POST","csvcompare",payload)

     console.log(data,"csv to csv") 
      setMisMatches(data.mismatches);
      console.log(misMatches, "missed");
      setmsg(data.message)
      // setVal(val.filter(item => item !== 'Drop Here'))

   }

  return (
    <>
      <h1 className="heading">Comparsion</h1>
      <div className={styles.level2}>
        <div className={styles.left}>
          <form>
            <input
              type="checkbox"
              id="dataMap"
              onChange={() => setSelected(!isSelected)}
            />
            <label className={styles.level2__content}>
              Enable the field mapping
            </label>
            <br />
            <button className="button" onClick={compare}>
              {type}
            </button>

            {/* <button onClick={()=>handleCSV()}>Compare csv to csv</button> */}

          </form>
        </div>
        {isSelected ? (
          <div className={styles.feildMapping}>
            <div className={styles.feilds}>
              {dataOptions.map((each, index) => (
                <div
                  className={styles.options}
                  draggable
                  onDrag={() => (feild1 = index)}
                >
                  <p>{each}</p>
                </div>
              ))}
            </div>
            <div className={styles.dropped}>
              <div className={styles.feilds}>
                {val.map((each, index) => (
                  <div
                    className={styles.options}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => dropOptions(index)}
                  >
                    <p>{each}</p>
                  </div>
                ))}
              </div>
              <div className={styles.feilds}>
                {dbOptions.map((each) => (
                  <div className={styles.options}>
                    <p>{each}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      {msg?<MisMatches dbOptions={dbOptions}/> :<>{msg}</>}
    </>
  );
}
