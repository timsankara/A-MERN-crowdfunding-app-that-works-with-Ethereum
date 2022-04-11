const mongoose = require("mongoose")

const Riparian = mongoose.model(
    "Riparian",
    new mongoose.Schema({
        areaName: String,
        // areaId: mongoose.Types.ObjectId,
        areaId: String,
        geometry: ""
    })
)

module.exports = Riparian;