const mongoose = require("mongoose")

const Withdrawal_request = mongoose.model(
    "Withdrawal_request",
    new mongoose.Schema({
        amount: {
            type: Number,
            required: true
        },
        campaign: String,
        contributors: {
            type: Array,
            required: true
        },
        vendor: String,
        approval_votes: {
            type: Number,
            default: 0
        },
        declined_votes: {
            type: Number,
            default: 0
        },
        total_votes: {
            type: Number,
            default: 0
        },
        handled: {
            type: Boolean,
            default: false
        }
    })
)

module.exports = Withdrawal_request;