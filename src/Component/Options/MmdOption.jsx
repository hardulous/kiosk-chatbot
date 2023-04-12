import React, { useContext, useState } from "react";
import { kioskContext } from "../../Util/KioskContext";

const MmdOption = () => {
  const { handleMessages, isBackup } = useContext(kioskContext);

  return (
    <>
      <div className="ship-list-container">
        <span
          className="ship-list-option"
          onClick={() => handleMessages("user", "", "", "Select Mmd")}
        >
         {isBackup ? "1. Select An Existing Backup File" : "1. Select An Existing Mmd"}
        </span>
        {!isBackup && (
          <span
            className="ship-list-option"
            onClick={() => handleMessages("user", "", "", "New Mmd")}
          >
            2. Create New Mmd
          </span>
        )}
      </div>
    </>
  );
};

export default MmdOption;
