const app = require("express").Router();
const { addCategory, updateCategory, deleteCategory, getAllCategories, recentCategories, getCategoryById } = require("../controller/categories.controller");
const validator = require('../../../validation/common.validation');
const { addCategoryValidation, updateCategoryValidation } = require("../validation/categories.validation");
const { checkSession } = require("../../../config/sessionAuth");


app.post("/addCategory", [checkSession, validator(addCategoryValidation)], addCategory);

app.post("/updateCategory/:id", [checkSession, validator(updateCategoryValidation)], updateCategory);


app.post("/deleteCategory/:id", checkSession, deleteCategory);

app.get("/getAllCategories", checkSession, getAllCategories);

app.get("/recentCategories", checkSession, recentCategories);

app.get("/getCategoryById/:id", getCategoryById);

module.exports = app;
