import { CSVInputs } from "../../components/CSVInputs/CSVInputs";
import FeildMapping from "../../components/FeildMapping/FeildMapping";
import Header from "../../components/Header/header";
import { Stepper,StepLabel,Step } from "@mui/material";
import MisMatches from "../../components/MisMatches/misMatches";
import { useContext } from "react";
import { field } from "../../App";
import { CSVStatus } from "../../components/CSVStatus/CSVStatus";
export const CSVtoCSV=()=>{
    const {currentStep, csvFields}=useContext(field)
    const showStep = (step)=>{
        switch(step){
            case 1: 
                return <CSVInputs/>
            case 2:
                return <CSVStatus/>
            case 3:
                return <FeildMapping dataOptions={csvFields.sourceHeaders} dbOptions={csvFields.targetHeaders} type={"csv to csv"}/>
            case 4:
                return <MisMatches/>
        } 
    } 
    return(
        <>
            <Header title={"CSV to CSV comparsion"} route={""}/>
            <div className="stepcontainer">
            <Stepper activeStep={1} orientation="horizontal" className="stepper">
                <Step>
                    <StepLabel></StepLabel>
                </Step>
                <Step>
                    <StepLabel></StepLabel>
                </Step>
                <Step>
                    <StepLabel></StepLabel>
                </Step>
                <Step>
                    <StepLabel></StepLabel>
                </Step>

            </Stepper>
            {showStep(currentStep)}

            </div>
        </>
    );
}