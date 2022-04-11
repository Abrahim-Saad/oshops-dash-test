const app = require("express").Router();
const { addStore, updateStore, deleteStore, getAllStores, getStoreCategories, getStoreById, recentStores, countUsersCategoriesStores } = require("../controller/stores.controller");
const validator = require('../../../validation/common.validation');
const { addStoreValidation, updateStoreValidation } = require("../validation/stores.validation");

const { checkSession } = require("../../../config/sessionAuth");

app.post("/addStore", [checkSession, validator(addStoreValidation)], addStore);

app.post("/updateStore/:id", [checkSession, validator(updateStoreValidation)], updateStore);

app.post("/deleteStore/:id", checkSession, deleteStore);

app.get("/getAllStores", checkSession, getAllStores);
app.get("/getStoreCategories/:id", checkSession, getStoreCategories);
app.get("/getStoreById/:id", checkSession, getStoreById);
app.get("/recentStores", checkSession, recentStores);
app.get("/countUsersCategoriesStores", checkSession, countUsersCategoriesStores);

module.exports = app;
