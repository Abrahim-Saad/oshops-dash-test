const mongoose = require('mongoose');
const advertismentSchema = require('../schema/advertisment.schema');

const advertismentModel = mongoose.model('advertisment', advertismentSchema);

module.exports = advertismentModel;