import { Avatar } from "@mui/material";
import React, { useEffect } from "react";
import { FaUser } from "react-icons/fa";

const UserMessage = ({ uuid, message }) => {
  useEffect(() => {
    scrollToBtm();
  }, []);

  // Function to scroll to bottom
  const scrollToBtm = () => {
    let element = document.getElementById("botId");
    element.scrollTo({
      top:  element.scrollHeight - element.clientHeight,
      behavior: "smooth"
    });
  };

  return (
    <div className="user-message-container">
      <div className="userMessage">
        <span>{message}</span>
      </div>
      <Avatar variant="circular" className="botAvatar">
        <FaUser />
      </Avatar>
    </div>
  );
};

export default UserMessage;
