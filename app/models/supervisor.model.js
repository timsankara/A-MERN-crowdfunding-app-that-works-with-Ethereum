const mongoose = require("mongoose")

const Supervisor = mongoose.model(
    "Supervisor",
    new mongoose.Schema({
        name: String,
        tasks: [],
        region: [],
        isActive: {
            type: Boolean,
            default: true
        }
    })
)

module.exports = Supervisor;