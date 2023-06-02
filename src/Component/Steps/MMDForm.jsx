import {
  Alert,
  AlertTitle,
  Autocomplete,
  Button,
  CircularProgress,
  Collapse,
  DialogActions,
  Grid,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { GrFormAdd } from "react-icons/gr";
import { useFormik } from "formik";
import * as yup from "yup";
import "../../css/Pages.css";
import { kioskContext } from "../../Util/KioskContext";
import { useNavigate } from "react-router-dom";
import Bot from "../Bot/Bot";

const { ipcRenderer } = window;

const validationSchema = yup.object().shape({
  ship: yup.string().required("Ship Details is required"),
  system: yup.string().required("System Details is required"),
  MMD: yup.string().required("MMD Details is required"),
});

export const nextRef = createContext();

const MMDForm = (props) => {
  const navigate = useNavigate();
  const { handleNext } = props;

  const { connection, start, handleMessages, seterror } =
    useContext(kioskContext);

  const [loading, setloading] = useState(true);

  useEffect(() => {
    if (!connection && !start) {
      ipcRenderer.send("kill-jar");
      navigate("/");
    }
    if (connection) {
      let output = [];

      ipcRenderer.on("to-kiosk-front", (event, res) => {
        console.log(res);
        if (
          res.includes("DB Connection Successful") ||
          res.includes("Connected")
        ) {
          setloading(false);
        }
        if (
          res.includes("Ships.csv not found") ||
          res.includes("ShipSystem.csv not Found") ||
          res.includes("ShipSystemMMD.csv not ")
        ) {
          seterror(true);
        }
        if (res.includes("ShipNames,")) {
          output = [
            ...res?.split("\n")[0]?.replaceAll("ShipNames", "").split(","),
          ];
          output.shift();
          output.pop();
          console.log(output)
          handleMessages("bot", output, "shipList");
        }
        if (res.includes("ShipSystems,")) {
          output = [
            ...res?.split("\n")[0]?.replaceAll("ShipSystems", "").split(","),
          ];
          output.shift();
          output.pop();
          handleMessages("bot", output, "sysList");
        }
        if (res.includes("MmdNames,")) {
          output = [
            ...res?.split("\n")[0]?.replaceAll("MmdNames", "").split(","),
          ];
          output.shift();
          output.pop();
          handleMessages("bot", output, "mmdList");
        }
      });
    }
    if (!connection) {
      setloading(true);
    }
  }, [connection]);

  return (
    <div className="userForm">
      <nextRef.Provider value={handleNext}>
        {loading && <CircularProgress />}
        <Collapse
          in={!loading}
          style={{
            width: "100%",
          }}
        >
          <Bot />
        </Collapse>
      </nextRef.Provider>
    </div>
  );
};

export default MMDForm;
