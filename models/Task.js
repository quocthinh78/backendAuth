const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TaskSchema = new Schema({
    name: { type: String },
    description: { type: String },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project"
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    modifiedDate: Date
})

const Task = mongoose.model('Task', TaskSchema)
module.exports = Task