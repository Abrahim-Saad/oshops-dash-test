const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName : {
        type: String,
        required :true,
    },
    categoryImageURL : {
        type: String,
        required :true,
    },
});

module.exports = categorySchema;