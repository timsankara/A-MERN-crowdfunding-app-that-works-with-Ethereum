const mongoose = require("mongoose")

const Type = mongoose.model(
    "Type",
    new mongoose.Schema({
        typeName: String
    })
)

module.exports = Type;