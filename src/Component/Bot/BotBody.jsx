import React, { useContext } from "react";
import { kioskContext } from "../../Util/KioskContext";

const BotBody = () => {
  const { messages } = useContext(kioskContext);
  return (
    <div>
      {messages.map((item, index) => {
        return item.component;
      })}
    </div>
  );
};

export default BotBody;
