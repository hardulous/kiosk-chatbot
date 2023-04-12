import { IconButton, TextField } from "@mui/material";
import { Send } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useContext, useEffect, useState } from "react";
import { kioskContext } from "../../Util/KioskContext";

const BotInput = () => {
  const {
    handleMessages,
    inputShip,
    inputSys,
    inputMmd,
    shipList,
    sysList,
    mmdList,
    error
  } = useContext(kioskContext);

  const validationSchema = Yup.object({
    userQuery: Yup.string().trim().required("Enter A Valid Query"),
  });

  const initialValues = {
    userQuery: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: ToJar,
  });

  function ToJar(data, action) {
    let item;
    let inp = data.userQuery;
    let invalid = isNaN(inp);
    if (inputShip && !invalid && inp <= shipList.length) {
      item = shipList.find((ship, i) => {
        return Number(inp) === i + 1;
      });

      handleMessages("user", item, "", "input-ship");
    } else if (inputSys && !invalid && inp <= sysList.length) {
      item = sysList.find((sys, i) => {
        return Number(inp) === i + 1;
      });

      handleMessages("user", item, "", "input-sys");
    } else if (inputMmd && !invalid && inp <= mmdList.length) {
      item = mmdList.find((mmd, i) => {
        return Number(inp) === i + 1;
      });

      handleMessages("user", item, "", "input-mmd");
    } else {
      handleMessages("user", inp);
    }

    action.resetForm();
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        name="userQuery"
        size="small"
        className="bot-user-input"
        id="userQuery"
        placeholder="Enter Your Message Here"
        variant="outlined"
        value={formik.values.userQuery}
        onChange={formik.handleChange}
        disabled={error}
      />
      <IconButton
        className="bot-input-send-btn"
        type="submit"
        color="primary"
        size="small"
        disabled={!Boolean(formik.values.userQuery) || error}
      >
        <Send />
      </IconButton>
    </form>
  );
};

export default BotInput;
