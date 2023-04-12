import React, { useContext, useState } from "react";
import { kioskContext } from "../../Util/KioskContext";
const { ipcRenderer } = window;

const MmdList = () => {
  const { mmdList, handleMessages, handleSend, setMmdList, isBackup } =
    useContext(kioskContext);
  const [more, setMore] = useState(true);

  const getMoreMmd = () => {
    console.log(mmdList.length);
    handleSend("l");
    handleSend(mmdList.length);
  };

  ipcRenderer.on("to-kiosk-front", (event, res) => {
    if (res.includes("MoreMmds,")) {
      let output;
      console.log(res);
      output = [...res?.split("\n")[0]?.replaceAll("MoreMmds", "").split(",")];
      output.shift();
      output.pop();
      if (output.indexOf("") !== -1) {
        setMore(false);
      } else {
        setMmdList([...mmdList].concat(output));
      }
    }
  });

  const validate = () => {
    return mmdList.indexOf("") == -1 && mmdList.length > 0;
  };

  return (
    <>
      <div className="ship-list">
        {validate() ? (
          <>
            {mmdList.map((item, i) => {
              return (
                <span
                  className="item"
                  key={i}
                  onClick={() =>
                    handleMessages("user", item, "", "mmd-selected")
                  }
                >
                  {i + 1}. {item}
                </span>
              );
            })}
            {more && (
              <span onClick={getMoreMmd} className="more">
                View More
              </span>
            )}
          </>
        ) : (
          <>
            <span className="valid">Mmdlist is empty</span>
            {!isBackup && (
              <span
                className="ship-list-option"
                onClick={() => handleMessages("user", "", "", "New Mmd")}
              >
                1. Create New Mmd
              </span>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default MmdList;
