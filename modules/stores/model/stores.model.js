const mongoose = require('mongoose');
const storeSchema = require('../schema/stores.schema');

const storeModel = mongoose.model('store', storeSchema);

module.exports = storeModel;