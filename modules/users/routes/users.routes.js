const app = require("express").Router();
const { signUp, userSignIn, editUserProfile, resetPassword, addAddress, removeAddress, getAllUsers, getCurrentUser, sendOrder} = require('../controller/users.controller');
const validator = require('../../../validation/common.validation');
const { userSignInValidation, editUserProfileValidation, signUpValidation, resetPasswordValidation, addAddressValidation, sendOrderValidation} = require("../validation/users.validation");
const { checkSession } = require("../../../config/sessionAuth");

app.post("/signUp", [validator(signUpValidation)], signUp);

app.post("/userSignIn", [validator(userSignInValidation)], userSignIn);

app.put("/editUserProfile", [checkSession, validator(editUserProfileValidation)], editUserProfile);
app.put("/resetPassword", [checkSession, validator(resetPasswordValidation)], resetPassword);
app.put("/addAddress", [checkSession, validator(addAddressValidation)], addAddress);
app.put("/removeAddress", checkSession, removeAddress);
app.get("/getAllUsers", checkSession, getAllUsers);
app.get("/getCurrentUser", checkSession, getCurrentUser);
app.post("/sendOrder", [checkSession, validator(sendOrderValidation)], sendOrder);

module.exports = app;
