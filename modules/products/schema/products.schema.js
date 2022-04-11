const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    productImageURL: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
        min: [0, 'Rate must be between 0 and 5'],
        max: [5, 'Rate must be between 0 and 5'],
        default: 0
    },
    inStock: {
        type: Boolean,
        required: true,
        default: true
    },
    topProduct: {
        type: Boolean,
        required: true,
        default: false
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store',
        required: true,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true,
    },
});

module.exports = productSchema;