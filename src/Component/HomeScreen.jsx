import React, { useContext, useEffect, useState } from "react";
import "../css/App.css";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Dialog } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FcDataBackup, FcSelfServiceKiosk } from "react-icons/fc";
import { MdOutlineBackup } from "react-icons/md";
import { kioskContext } from "../Util/KioskContext";

const HomeScreen = () => {
  const navigate = useNavigate();
  const { setStart, start, setisBackup } = useContext(kioskContext);

  const handleRoute = (path) => {
    path && navigate(path);
    setStart(true);
  };

  useEffect(() => {
    if (start) {
      setStart(false);
    }
  }, [start]);

  return (
    <div className="App">
      <div className="welcome-form">
        <div className="left">
          <div className="left-content">
            <img
              src={`${process.env.PUBLIC_URL}/Seg.png`}
              width={337}
              height={337}
            />
            <span>Kiosk for Extraction & Restoration</span>
          </div>
        </div>
        <div className="right">
          <div
            className="btn-backup"
            onClick={() => {
              setisBackup(true);
              handleRoute("/backup");
            }}
          >
            <MdOutlineBackup />
            <span>Restoration</span>
          </div>
          <div
            className="btn-restore"
            onClick={() => {
              setisBackup(false);
              handleRoute("/restore");
            }}
          >
            <FcDataBackup />
            <span>Extraction</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(HomeScreen);
