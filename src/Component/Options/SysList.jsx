import React, { useContext, useState } from "react";
import { kioskContext } from "../../Util/KioskContext";
const { ipcRenderer } = window;

const SysList = () => {
  const { sysList, handleMessages, handleSend, setsysList, isBackup } =
    useContext(kioskContext);
  const [more, setMore] = useState(true);

  const getMoreSys = () => {
    console.log(sysList.length);
    handleSend("k");
    handleSend(sysList.length);
  };

  ipcRenderer.on("to-kiosk-front", (event, res) => {
    if (res.includes("MoreSystems,")) {
      let output;
      console.log(res);
      output = [
        ...res?.split("\n")[0]?.replaceAll("MoreSystems", "").split(","),
      ];
      output.shift();
      output.pop();
      if (output.indexOf("") !== -1) {
        setMore(false);
      } else {
        setsysList([...sysList].concat(output));
      }
    }
  });

  const validate = () => {
    return sysList.indexOf("") == -1 && sysList.length > 0;
  };

  return (
    <>
      <div className="ship-list">
        {validate() ? (
          <>
            {sysList.map((item, i) => {
              return (
                <span
                  className="item"
                  key={i}
                  onClick={() =>
                    handleMessages("user", item, "", "sys-selected")
                  }
                >
                  {i + 1}. {item}
                </span>
              );
            })}
            {more && (
              <span onClick={getMoreSys} className="more">
                View More
              </span>
            )}
          </>
        ) : (
          <>
            <span className="valid">Systemlist is empty</span>
            {!isBackup && (
              <span
                className="ship-list-option"
                onClick={() => handleMessages("user", "", "", "New Sys")}
              >
                1. Create New System
              </span>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default SysList;
