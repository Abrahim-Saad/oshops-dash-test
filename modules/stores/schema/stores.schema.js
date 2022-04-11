const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    storeName: {
        type: String,
        required: true,
    },
    storeLogoURL: {
        type: String,
        required: true,
    },
    telephoneNumbers: [{
        type: Number,
        required: true,
    }],
    storeWebsite: {
        type: String,
        required: true,
    },
    storeCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true,
    }],
    canBeAddedToCart: {
        type: Boolean,
        default: true,
        required: true
    },
    isComparable: {
        type: Boolean,
        default: true,
        required: true
    }
});

module.exports = storeSchema;
