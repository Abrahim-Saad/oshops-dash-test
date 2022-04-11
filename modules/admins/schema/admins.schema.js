const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 5;

const adminSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required :true,
    },
    lastName : {
        type: String,
        required :true,
    },
    userName : {
        type: String,
        required :true,
    },
    password : {
        type: String,
        required :true,
    },
    role: {
        type: String,
        required :true,
    }
});

adminSchema.pre("save", async function(next){
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
})

module.exports = adminSchema;