const mongoose = require("mongoose");

const Task = mongoose.model(
    "Task",
    new mongoose.Schema({
        region: String,
        assignees: [],
        assigneeNames: [],
        supervisor: String,
        isComplete: {
            type: Boolean,
            default: false
        },
        location: [],
        approved: {
            type: Boolean,
            default: false
        },
        date: {
            type: Date,
            default: Date.now()
        },
        startTime: {
            type: Date
        },
        endTime: {
            type: Date
        },
        duration: {
            type: Number,
            default: 0
        },
        inProgess: {
            type: Boolean,
            default: false
        },
        regionName: String,
        supervisorName: String,
        deadline: {
            type: Date
        }
    })
)

module.exports = Task;