const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  orders: [
    {
      name: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    },
  ],
});

module.exports = mongoose.model("order", orderSchema);
