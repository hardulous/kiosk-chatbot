import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { useContext, useRef } from "react";
import { kioskContext } from "../../Util/KioskContext";

const ProcessMode = ({ handleNext }) => {
  const valRef = useRef("");
  const { setMode } = useContext(kioskContext);

  const handleChange = (e) => {
    valRef.current = e.target.value;
  };

  return (
    <div className="process-mode-con">
      <FormControl className="process-mode">
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          onChange={handleChange}
        >
          <FormControlLabel
            value="dd"
            control={<Radio size="medium" />}
            label="Disk/Data Dublicator"
            labelPlacement="top"
          />
          <FormControlLabel
            value="clonezilla"
            control={<Radio size="medium" />}
            label="Clonezilla"
            labelPlacement="top"
          />
          <FormControlLabel
            value="gzip"
            control={<Radio size="medium" />}
            label="Gzip"
            labelPlacement="top"
          />
          <FormControlLabel
            value="aomei"
            control={<Radio size="medium" />}
            label="Aomei"
            labelPlacement="top"
          />
        </RadioGroup>
      </FormControl>
      <Button
        variant="outlined"
        onClick={() => {
          setMode(valRef.current);
          handleNext();
        }}
      >
        Next
      </Button>
    </div>
  );
};

export default ProcessMode;
