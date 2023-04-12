import React, { useContext, useState } from "react";
import { kioskContext } from "../../Util/KioskContext";

const ShipOption = () => {
  const { handleMessages, isBackup } = useContext(kioskContext);

  return (
    <>
      <div className="ship-list-container">
        <span
          className="ship-list-option"
          onClick={() => handleMessages("user", "", "", "Select Ship")}
        >
          1. Select An Existing Ship
        </span>
        {!isBackup && (
          <span
            className="ship-list-option"
            onClick={() => handleMessages("user", "", "", "New Ship")}
          >
            2. Create New Ship
          </span>
        )}
      </div>
    </>
  );
};

export default ShipOption;
