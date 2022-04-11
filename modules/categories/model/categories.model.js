const mongoose = require('mongoose');
const categorySchema = require('../schema/categories.schema');

const categoryModel = mongoose.model('category', categorySchema);

module.exports = categoryModel;