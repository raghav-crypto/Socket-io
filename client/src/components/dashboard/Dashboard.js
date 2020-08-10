import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Typography,
  Button,
  Paper,
  CircularProgress,
  Card,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import socket from "../../socketConfig.js";

function Dashboard({ authenticated, loading, email }) {
  const [orders, setOrders] = useState(null);
  // const [noOrder, setNoOrder] = useState(null);
  dayjs.extend(relativeTime);
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      socket.emit("init", email);
    }
    return () => (mounted = false);
  }, [email]);
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      socket.emit("get-orders", email);
    }
    return () => (mounted = false);
  }, [email]);
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      socket.on("updateOrders", (data) => {
        setOrders(data.orders);
      });
    }
    return () => (mounted = false);
  }, []);
  console.log(orders);
  if (!loading && !authenticated) {
    return (
      <div className="dashboard">
        <Paper className="paper">
          <Typography variant="h4">User Not Logged In</Typography>
          <div className="buttons">
            <Button
              className="login"
              component={Link}
              to="/login"
              variant="contained"
              color="secondary"
            >
              Log In
            </Button>
            <Button
              className="register"
              component={Link}
              to="/register"
              color="primary"
            >
              Register
            </Button>
          </div>
        </Paper>
      </div>
    );
  } else {
    if (orders === null || loading) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "150px",
          }}
        >
          <CircularProgress size={120} thickness={2} />
        </div>
      );
    } else {
      return (
        <div className="dashboard">
          <Paper className="paper">
            <Typography variant="h4">View Order : {email}</Typography>
            <Typography variant="h6">{orders.length} order's</Typography>

            {orders.map((order) => (
              <Card
                style={{
                  width: "inherit",
                  textAlign: "center",
                  margin: "1em",
                  background: "#d54062",
                  color: "#dddddd",
                }}
                key={order._id}
              >
                <Typography variant="h5">{order.name}</Typography>
                <span>{dayjs(order.date).from(dayjs(), true)}</span>
              </Card>
            ))}
            {!orders.length && (
              <Typography
                style={{
                  marginTop: "2em",
                  background: "#4b5d67",
                  color: "#dddddd",
                }}
                variant="h4"
              >
                No Order's yet !
              </Typography>
            )}
          </Paper>
        </div>
      );
    }
  }
}
const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  loading: state.user.loading,
  email: state.user.credentials.email,
});
export default connect(mapStateToProps)(Dashboard);
