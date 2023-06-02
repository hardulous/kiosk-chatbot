import * as React from "react";
import PropTypes from "prop-types";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Alert, AlertTitle, Button, Collapse } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { kioskContext } from "../../Util/KioskContext";
import { useEffect, useState, useContext } from "react";
const { ipcRenderer } = window;

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

export default function LinearWithValueLabel() {
  const [progress, setProgress] = useState(0);
  const [logs, setlogs] = useState("");

  const navigate = useNavigate();
  const { connection, start, handleReset, isBackup, mode } =
    useContext(kioskContext);

  useEffect(() => {
    handleShExecute();
  }, [mode]);

  React.useEffect(() => {
    if (!connection && !start) {
      ipcRenderer.send("kill-jar");
      navigate("/");
    }
  }, [connection]);

  const handleShExecute = () => {
    ipcRenderer.on("backup-progress", (event, val) => {
      setProgress((prevProgress) => prevProgress + val);
    });

    ipcRenderer.on("extract-progress", (event, val) => {
      setProgress((prevProgress) => prevProgress + val);
    });

    ipcRenderer.on("clonezilla-log", (event, val) => {
      console.log(val);
      setlogs((text) => text + val);
    });
  };
  console.log(logs);

  return (
    <Box sx={{ width: "100%" }}>
      {progress < 100 ? (
        <LinearProgressWithLabel value={progress} />
      ) : (
        <>
          <Alert severity="success">
            <AlertTitle>Task completed Successfully</AlertTitle>
          </Alert>

          <Collapse
            className={`${Boolean(logs) ? "logs-screen" : "logs-screen-hide"}`}
            in={Boolean(logs)}
          >
            {logs}
          </Collapse>

          <div style={{ marginTop: "1.5rem" }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <Button variant="contained" onClick={handleReset}>
                Back to Home page
              </Button>
            </Link>
          </div>
        </>
      )}
    </Box>
  );
}
