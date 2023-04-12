import {
  Alert,
  AlertTitle,
  Button,
  Collapse,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { kioskContext } from "../../Util/KioskContext";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
const { ipcRenderer } = window;

const validationSchema = yup.object().shape({
  password: yup.string().required("Approval of Supervisor is mandatory"),
});
const ApprovalForm = (props) => {
  const navigate = useNavigate();

  const { connection, start, setSvPassword } = useContext(kioskContext);
  const [showPassword, setshowPassword] = useState(false);
  const [error, seterror] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, action) => {
      if (values.password !== "admin") {
        seterror(true);
      } else {
        setSvPassword(values.password);
        props.handleNext();
      }
      action.resetForm();
    },
  });

  useEffect(() => {
    ipcRenderer.send("to-kiosk-back", "m");
  }, []);

  useEffect(() => {
    if (!connection && !start) {
      ipcRenderer.send("kill-jar");
      navigate("/");
    }
  }, [connection]);

  const handleClickShowPassword = () => {
    setshowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Grid>
          <Collapse in={error}>
            <Alert severity="error" onClose={() => seterror(false)}>
              <AlertTitle>Incorrect Password</AlertTitle>
              Make Sure The Entered Password Is Correct
            </Alert>
          </Collapse>
          <TextField
            size="small"
            name="password"
            label="Password"
            variant="outlined"
            fullWidth
            type={showPassword ? "text" : "password"}
            margin="dense"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1rem",
            }}
          >
            <Button variant="outlined" type="submit">
              Submit
            </Button>
          </div>
        </Grid>
      </form>
    </div>
  );
};

export default ApprovalForm;
