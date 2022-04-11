const mongoose = require("mongoose")

const Region = mongoose.model(
    "Campaign",
    new mongoose.Schema({
        campaign_name: String,
        campaign_description: String,
        campaign_target: Number,
        campaign_funds_address: String,
        campaign_funds_address_pk: String,
        campaign_creator: String,
        current_amount: {
            type: Number,
            default: 0

        },
        campaign_contributors: {
            type: [],
            default: []
        },
        campaign_creation_date: {
            type: Date,
            default: Date()
        },
        campaign_end_date: {
            type: Date,
        },
        index: String,
        creator: String
    })
)

module.exports = Region;