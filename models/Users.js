const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const UserSchema = new Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    roles: { type: String, default: "employee" },
    authGoogleId: {
        type: String,
        default: null
    },
    authFaceBookId: {
        type: String,
        default: null
    },
    authType: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        default: 'local'
    },
    decks: [{
        type: Schema.Types.ObjectId,
        ref: 'Deck'
    }],
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'Task'
    }],
    projects: [{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }]
})
UserSchema.pre("save", async function(next) {
    try {
        if (this.authType !== 'local') next();
        //generate a salt
        const salt = await bcrypt.genSalt(10)
            //generate a passwort hash (salt + hash)
        const passwortHash = await bcrypt.hash(this.password, salt);
        // re-assign password
        this.password = passwortHash
        next();

    } catch (error) {
        next(error)
    }
})
UserSchema.methods.isValidPassword = async function(newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.password);
    } catch (error) {
        throw new Error('error')
    }
}
const User = mongoose.model('User', UserSchema)
module.exports = User