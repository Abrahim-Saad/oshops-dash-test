const mongoose = require('mongoose');

const advertismentSchema = new mongoose.Schema({
    title : {
        type: String,
        required :true,
    },
    advertismentImageURL : {
        type: String,
        required :true,
    },
    isActive: {
        type: Boolean,
        required: true
    }
});

module.exports = advertismentSchema;