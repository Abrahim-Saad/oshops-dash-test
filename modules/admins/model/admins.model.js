const mongoose = require('mongoose');
const adminSchema = require('../schema/admins.schema');

const adminModel = mongoose.model('admin', adminSchema);

module.exports = adminModel;