const app = require("express").Router();
const { addAdmin, adminSignIn, updateAdmin, deleteAdmin, getAllAdmins, getCurrentAdmin, getAdminById } = require('../controller/admins.controller');
const validator = require('../../../validation/common.validation');
const { addAdminValidation, updateAdminValidation, adminSignInValidation } = require("../validation/admins.validation");
const { checkSession } = require("../../../config/sessionAuth");

app.post("/addAdmin", [checkSession, validator(addAdminValidation)], addAdmin);

app.post("/adminSignIn", [checkSession, validator(adminSignInValidation)], adminSignIn);

app.post("/updateAdmin/:id", [checkSession, validator(updateAdminValidation)], updateAdmin);

app.post("/deleteAdmin/:id", checkSession, deleteAdmin);

app.get("/getAllAdmins", checkSession, getAllAdmins);
app.get("/getCurrentAdmin", checkSession, getCurrentAdmin);
app.get("/getAdminById/:id", checkSession, getAdminById);


module.exports = app;