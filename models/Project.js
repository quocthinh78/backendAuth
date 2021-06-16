const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProjectSchema = new Schema({
    name: { type: String },
    description: { type: String },
    owner: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: "Task"
    }],
    createdDate: {
        type: Date,
        default: Date.now
    },
    modifiedDate: Date

})

const Project = mongoose.model('Project', ProjectSchema)
module.exports = Project