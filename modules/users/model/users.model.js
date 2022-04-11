const mongoose = require("mongoose");
const userSchema = require("../schema/users.schema");

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
