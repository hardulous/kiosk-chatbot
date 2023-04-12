import React, { useContext, useState } from "react";
import { kioskContext } from "../../Util/KioskContext";

const SysOption = () => {
  const { handleMessages, isBackup } = useContext(kioskContext);

  return (
    <>
      <div className="ship-list-container">
        <span
          className="ship-list-option"
          onClick={() => handleMessages("user", "", "", "Select Sys")}
        >
          1. Select An Existing System
        </span>
        {!isBackup && (
          <span
            className="ship-list-option"
            onClick={() => handleMessages("user", "", "", "New Sys")}
          >
            2. Create New System
          </span>
        )}
      </div>
    </>
  );
};

export default SysOption;
