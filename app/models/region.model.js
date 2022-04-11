const mongoose = require("mongoose")

const Region = mongoose.model(
    "Region",
    new mongoose.Schema({
        regionName: String,
        users: []
    })
)

module.exports = Region;