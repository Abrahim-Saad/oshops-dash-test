const app = require("express").Router();
const { addAdvertisment, updateAdvertisment, deleteAdvertisment, getAllAdvertisments, getAdvertismentById, getAllActiveAdvertisments } = require("../controller/advertisment.controller");
const validator = require('../../../validation/common.validation');
const { addAdvertismentValidation, updateAdvertismentValidation } = require("../validation/advertisment.validation");
const { checkSession } = require("../../../config/sessionAuth");


app.post("/addAdvertisment", [checkSession, validator(addAdvertismentValidation)], addAdvertisment);

app.post("/updateAdvertisment/:id", [checkSession, validator(updateAdvertismentValidation)], updateAdvertisment);

app.post("/deleteAdvertisment/:id", checkSession, deleteAdvertisment);

app.get("/getAllAdvertisments", checkSession, getAllAdvertisments);

app.get("/getAllActiveAdvertisments", checkSession,getAllActiveAdvertisments);

app.get("/getAdvertismentById/:id", checkSession, getAdvertismentById);

module.exports = app;
