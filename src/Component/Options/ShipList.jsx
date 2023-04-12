import React, { useContext, useState } from "react";
import { kioskContext } from "../../Util/KioskContext";
const { ipcRenderer } = window;

const ShipList = () => {
  const { shipList, handleMessages, handleSend, setShipList, isBackup } =
    useContext(kioskContext);
  const [more, setMore] = useState(true);

  const getMoreShip = () => {
    handleSend("j");
    handleSend(shipList.length);
  };

  ipcRenderer.on("to-kiosk-front", (event, res) => {
    if (res.includes("MoreShips,")) {
      let output;
      console.log(res);
      output = [...res?.split("\n")[0]?.replaceAll("MoreShips", "").split(",")];
      output.shift();
      output.pop();
      if (output.indexOf("") !== -1) {
        setMore(false);
      } else {
        setShipList([...shipList].concat(output));
      }
    }
  });

  const validate = () => {
    return shipList.indexOf("") == -1 && shipList.length > 0;
  };

  return (
    <>
      <div className="ship-list">
        {validate() ? (
          <>
            {shipList.map((item, i) => {
              return (
                <span
                  className="item"
                  key={i}
                  onClick={() =>
                    handleMessages("user", item, "", "ship-selected")
                  }
                >
                  {i + 1}. {item}
                </span>
              );
            })}
            {more && (
              <span onClick={getMoreShip} className="more">
                View More
              </span>
            )}
          </>
        ) : (
          <>
            <span className="valid">Shiplist iS empty</span>
            {!isBackup && (
              <span
                className="ship-list-option"
                onClick={() => handleMessages("user", "", "", "New Ship")}
              >
                1. Create New Ship
              </span>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ShipList;
