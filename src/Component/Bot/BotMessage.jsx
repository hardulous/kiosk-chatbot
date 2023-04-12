import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FaRobot } from "react-icons/fa";
import Loading from "./Loading";

const BotMessage = ({ uuid, message, option, valid, hReload }) => {
  const [loading, setloading] = useState(true);

  useState(() => {
    setTimeout(() => {
      setloading(false);
    }, 400);
  }, []);

  useEffect(() => {
    if (!loading) scrollToBtm();
  }, [loading]);

  // Function to scroll to bottom
  const scrollToBtm = () => {
    let element = document.getElementById("botId");
    element.scrollTo({
      top: element.scrollHeight - element.clientHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="bot-message-container">
      <Avatar variant="circular" className="botAvatar">
        <FaRobot />
      </Avatar>
      <div className="botMessage">
        {loading ? (
          <Loading />
        ) : (
          <>
            {valid && <span className="valid">Select A Valid Option</span>}
            <span className={`${hReload && "valid"}`}>{message}</span>
            {option}
          </>
        )}
      </div>
    </div>
  );
};

export default BotMessage;
