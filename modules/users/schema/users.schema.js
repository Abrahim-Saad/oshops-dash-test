const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 5;

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePictureURL: {
        type: String,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    role: {
        type: String,
        default: "user",
    }
});

userSchema.pre("save", async function(next){
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
})

module.exports = userSchema;