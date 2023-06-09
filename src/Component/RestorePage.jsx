import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import { Grid, IconButton, Paper } from "@mui/material";
import MMDForm from "./Steps/MMDForm";
import ApprovalForm from "./Steps/ApprovalForm";
import ProgressStatus from "./Steps/ProgressStatus";
import "../css/Pages.css";
import { useEffect } from "react";
import { kioskContext } from "../Util/KioskContext";
import { useContext } from "react";
import { Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ProcessMode from "./Steps/ProcessMode";
const { ipcRenderer } = window;

function getSteps() {
  return [
    "Fill The Necessary Details",
    "Mode Of Extraction",
    "Approval of Supervisor",
    "Start Extraction Process",
  ];
}

export default function ActiveStep() {
  function getStepContent(step) {
    switch (step) {
      case 0:
        return <MMDForm handleNext={handleNext} />;
      case 1:
        return <ProcessMode handleNext={handleNext} />;
      case 2:
        return <ApprovalForm handleNext={handleNext} />;
      case 3:
        return <ProgressStatus handleNext={handleNext} />;
      default:
        return "";
    }
  }

  const navigate = useNavigate();

  const { handleReset } = useContext(kioskContext);
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();

  // console.log(loading);

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  const backToHome = () => {
    ipcRenderer.send("kill-jar");
    handleReset();
    navigate("/", {
      replace: true,
    });
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  return (
    <div className="FormPage">
      <Paper elevation={5} className="muiPaper">
        <Grid>
          <div className="form-stepper">
            <IconButton
              color="primary"
              className="home-btn"
              onClick={backToHome}
            >
              <Home />
            </IconButton>
            <Stepper activeStep={activeStep} className="meetingform">
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};

                if (isStepOptional(index)) {
                  labelProps.optional = (
                    <Typography variant="caption"></Typography>
                  );
                }
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </div>
          {
            <div>
              {activeStep === steps.length ? null : (
                <h6>{getStepContent(activeStep)}</h6>
              )}
            </div>
          }
        </Grid>
      </Paper>
    </div>
  );
}
