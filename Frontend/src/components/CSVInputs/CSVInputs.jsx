import { request } from "../../services/Axios/calls";
import { useForm } from "react-hook-form";
import styles from "./CSVInputs.module.scss";
import { useContext, useEffect } from "react";
import { field } from "../../App";
// import FeildMapping from "../FeildMapping/FeildMapping";

export const CSVInputs = () => {
  const { setCSVFields, csvFields,setStep } = useContext(field);
  const fileform = useForm({ mode: "onBlur" });
  const { register: registerForm2, handleSubmit: handleSubmitForm2 } = fileform;
  useEffect(() => {
    if(csvFields.sourceFile!='' && csvFields.sourceHeaders.length==0)
        compare();
  }, [csvFields]);

  const setFormData = async (data) => {
    const formData = new FormData();
    formData.append("file", data.Filename1[0]);
    formData.append("file", data.Filename2[0]);
    upload(formData);
    setStep(2)
  };
  const compare = async () => {
    const initialRes = await request("POST", "initialcsvcompare", {
      source: csvFields.sourceFile,
      target: csvFields.targetFile,
    });
    setCSVFields((prev) => ({
      ...prev,
      status: initialRes.message,
      sourceHeaders: initialRes.header1,
      targetHeaders: initialRes.header2,
    }));
  };
  const upload = async (formData) => {
    const res = await request("POST", "csvfile", formData);
    setCSVFields((prev) => ({
      ...prev,
      sourceFile: res.sourceFile,
      targetFile: res.targetFile,
    }));
  };
  console.log(csvFields, "outer");

  return (
    <div>
      <form onSubmit={handleSubmitForm2(setFormData)} className={styles.form}>
        <div className={styles.input}>
          <label>Source</label>
          <input
            type="file"
            id="fileInput1"
            {...registerForm2("Filename1", {
              required: "*File is Mandatory Field",
            })}
          />
        </div>
        <div className={styles.input}>
          <label>Target</label>
          <input
            type="file"
            id="fileInput2"
            {...registerForm2("Filename2", {
              required: "*File is Mandatory Field",
            })}
          />
        </div>
        <button type="submit" className={styles.submit}>
          Submit
        </button>
      </form>
      {/* <p>{csvFields.status}</p> */}
      {/* <button >Next</button> */}
      {/* {csvFields.file1.length>0?<FeildMapping dataOptions={csvFields.sourceHeaders} dbOptions={csvFields.targetHeaders} type={"csvtocsv"}/>:<></>} */}
    </div>
  );
};
