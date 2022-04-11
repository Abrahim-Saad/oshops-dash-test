const mongoose = require('mongoose');
const productSchema = require('../schema/products.schema');

const productModel = mongoose.model('product', productSchema);

module.exports = productModel;