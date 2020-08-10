const express = require("express");
const app = express();
const connectDB = require("./config/db");
const socketio = require("socket.io");
const Orders = require("./models/Orders");
const PORT = process.env.PORT || 5000;
const expressServer = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
const io = socketio(expressServer);

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
io.on("connect", (socket) => {
  socket.on("create-order", async (data) => {
    let orders = await Orders.findOne({ user: data.email.toString() });
    if (!orders) {
      // Create User Order
      orders = new Orders();
      orders.user = data.email;
      const orderVariable = {
        name: data.order,
        creator: data.userId,
      };
      orders.orders.push(orderVariable);

      orders = await orders.save();
      // const orderId = orders._id.toString();
      // socket.join(orderId);
      io.to(data.email).emit("updateOrders", orders);
    } else {
      // Update
      const orderVariable = {
        name: data.order,
        creator: data.userId,
      };
      orders.orders.push(orderVariable);

      orders = await orders.save();
      // const orderId = orders._id.toString();
      // socket.join(orderId);
      io.to(data.email).emit("updateOrders", orders);
    }
  });
  socket.on("get-orders", async (email) => {
    if (email) {
      let orders = await Orders.findOne({ user: email.toString() });
      if (orders) {
        // socket.join(orderId);
        // io.to(orderId).emit("updateOrders", orders);
        email.toString();
        socket.join(email);
        io.to(email).emit("updateOrders", orders);
      }
    }
  });
  socket.on("init", (email) => {
    if (email) {
      email.toString();
      socket.join(email);
    }
  });
});
