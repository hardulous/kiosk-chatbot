import React, { useContext } from "react";
import { kioskContext } from "../../Util/KioskContext";
import { Button } from "@mui/material";

const Error = () => {
  const { hardReload } = useContext(kioskContext);

  return (
    <div className="ship-list-container">
      <Button
        onClick={() => hardReload()}
        variant="contained"
        color="error"
        size="small"
      >
        Hard Reload
      </Button>
    </div>
  );
};

export default Error;
