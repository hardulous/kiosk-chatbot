import React, { useContext } from "react";
import { kioskContext } from "../../Util/KioskContext";

const AllOptions = () => {
  const { handleMessages, isBackup } = useContext(kioskContext);
  let count = 1;

  return (
    <div className="ship-list-container">
      <span
        className="ship-list-option"
        onClick={() => handleMessages("user", "", "", "Select Ship")}
      >
        {count++}. Select An Existing Ship
      </span>
      {!isBackup && (
        <span
          className="ship-list-option"
          onClick={() => handleMessages("user", "", "", "New Ship")}
        >
          {count++}. Create New Ship
        </span>
      )}
      <span
        className="ship-list-option"
        onClick={() => handleMessages("user", "", "", "Select Sys")}
      >
        {count++}. Select An Existing System
      </span>
      {!isBackup && (
        <span
          className="ship-list-option"
          onClick={() => handleMessages("user", "", "", "New Sys")}
        >
          {count++}. Create New System
        </span>
      )}
      <span
        className="ship-list-option"
        onClick={() => handleMessages("user", "", "", "Select Mmd")}
      >
        {count++}.{" "}
        {isBackup ? "Select An Existing Backup File" : "Select An Existing Mmd"}
      </span>
      {!isBackup && (
        <span
          className="ship-list-option"
          onClick={() => handleMessages("user", "", "", "New Mmd")}
        >
          {count++}. Create New Mmd
        </span>
      )}
    </div>
  );
};

export default AllOptions;
