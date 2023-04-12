import {
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { FaRobot } from "react-icons/fa";
import BotBody from "./BotBody";
import BotInput from "./BotInput";
import "../../css/bot.css";
import "../../css/option.css";
import { kioskContext } from "../../Util/KioskContext";
import { useNavigate } from "react-router-dom";
const { ipcRenderer } = window;

const Bot = () => {
  
  const navigate = useNavigate();

  const { handleReset } = useContext(kioskContext); 
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setOpen(true);
  }, []);

  const backToHome = () => {
    ipcRenderer.send("kill-jar");
    handleReset();
    navigate("/", {
      replace: true,
    });
  };

  return (
    <>
      <div className="botContainer">
        <div className="botHeader">
          <IconButton
            className="botheader-icon"
            disableFocusRipple
            disableTouchRipple
            disableRipple
          >
            <Badge
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
              className="botHeader-badge"
              overlap="rectangular"
            >
              <FaRobot />
            </Badge>
          </IconButton>
          <div>
            <span
              style={{
                fontSize: "1.5rem",
              }}
            >
              Extraction & Restoration Chatbot
            </span>
            <span
              style={{
                color: "#808080ba",
              }}
            >
              Online
            </span>
          </div>
        </div>
        <div className="botBody" id="botId">
          <BotBody />
        </div>
        <div className="BotInput">
          <BotInput />
        </div>
      </div>

      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{
            fontWeight: "bold",
            color: "black",
          }}
        >
          {"IMPORTANT NOTE"}
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            id="alert-dialog-description"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <span
              style={{
                color: "black",
              }}
            >
              1. Make Sure The Memory Media Drive (MMD) Is Connected To The
              System Correctly
            </span>
            <span
              style={{
                color: "black",
              }}
            >
              2. Make Sure The Data Transfer Through DD Does Not Exceed 250 GB
            </span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={backToHome} variant="outlined" color="error">
            Disagree
          </Button>
          <Button
            onClick={handleClose}
            autoFocus
            variant="outlined"
            color="primary"
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Bot;
