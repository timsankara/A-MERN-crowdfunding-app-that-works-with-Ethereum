const mongoose = require("mongoose");

const Project = mongoose.model(
  "Project",
  new mongoose.Schema({
    zone: String,
    type: String,
    description: String,
    title: String,
    deedNo: String,
    area: String,
    userId: String,
    geometry: "",
    intersection: {
      type: Object
    },
    approved: {
      type: Boolean,
      default: false
    },
    computerApproved: {
      type: Boolean,
      default: false,
    },
    encroachedArea: {
      type: String,
    },
    encroaching: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date,
      default: Date.now()
    },
    typeName: String,
    zoneName: String
  })
);

module.exports = Project;
