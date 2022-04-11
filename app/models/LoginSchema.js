const mongoose = require("mongoose")

const LoginSchema = mongoose.model(
    "Logins",
    new mongoose.Schema({
        timeIn: {
            type: Date
        },
        timeOut: {
            type: Date,
        },
        timeSpentInMinutes: {
            type: Number,
            default: 0
        },
        location: [],
        userId: String,
        isLoggedin: {
            type: Boolean,
            default: true
        },

    })
)

module.exports = LoginSchema