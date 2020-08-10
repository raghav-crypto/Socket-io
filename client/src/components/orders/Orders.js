import React, { useEffect, useState } from "react";
import { loginTheme } from "../auth/Theme";
import socket from "../../socketConfig";
// MUI
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { CircularProgress, Grid, ThemeProvider } from "@material-ui/core";

import { useSelector } from "react-redux";

function Orders() {
  const userId = useSelector((state) => state.user.credentials._id);
  const [formData, setFormData] = useState({
    email: null,
    order: null,
  });
  const { email, order } = formData;
  const useStyles = makeStyles(loginTheme);
  const classes = useStyles();
  const onSubmit = (e) => {
    e.preventDefault();
    const variable = {
      userId,
      ...formData,
    };
    socket.emit("create-order", variable);
  };
  const onChange = (type, e) => {
    switch (type) {
      case "email":
        setFormData({ ...formData, email: e.target.value });
        break;
      case "order":
        setFormData({ ...formData, order: e.target.value });
      default:
        break;
    }
  };
  return (
    <main className={classes.main}>
      <CssBaseline></CssBaseline>
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h5">
          Place Order !
        </Typography>
        <form className={classes.form} onSubmit={(e) => onSubmit(e)}>
          <FormControl required fullWidth margin="normal">
            <InputLabel htmlFor="enter-email">Enter Email</InputLabel>
            <Input
              autoFocus
              label="Enter User"
              autoComplete="email"
              id="enter-email"
              onChange={(e) => onChange("email", e)}
            ></Input>
          </FormControl>
          <FormControl required fullWidth margin="normal">
            <InputLabel htmlFor="order-name">Order Name</InputLabel>
            <Input
              label="Order Name"
              id="order-name"
              onChange={(e) => onChange("order", e)}
            ></Input>
          </FormControl>
          <Button
            fullWidth
            type="submit"
            color="primary"
            className={classes.submit}
          >
            Place Order{" "}
            {/* {loading && (
              <CircularProgress size={30} className={classes.progress} />
            )} */}
          </Button>
        </form>
      </Paper>
    </main>
  );
}

export default Orders;
