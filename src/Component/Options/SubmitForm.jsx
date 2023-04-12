import React, { useContext } from "react";
import { kioskContext } from "../../Util/KioskContext";
import { nextRef } from "../Steps/MMDForm";

const SubmitForm = () => {
  const func = useContext(nextRef);
  const { handleMessages } = useContext(kioskContext);

  return (
    <div className="ship-list-container">
      <span className="ship-list-option" onClick={func}>
        1. Yes
      </span>
      <span
        className="ship-list-option"
        onClick={() => handleMessages("user", "No", "", "redo")}
      >
        2. No
      </span>
    </div>
  );
};

export default SubmitForm;
