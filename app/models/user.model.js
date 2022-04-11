const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    email: String,
    password: String,
    reg_date: {
      type: Date,
      default: Date()
    },
    campaigns_donated_to: {
      type: Array,
      default: []
    }
  })
);

module.exports = User;
