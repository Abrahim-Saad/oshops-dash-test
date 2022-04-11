const app = require("express").Router();
const { addProduct, updateProduct, deleteProduct, getAllProducts, getProductById, topRatedProducts, storeTopRatedProducts,
    storeProducts, productsByStoreAndCategory, productSearch } = require("../controller/products.controller");

const validator = require('../../../validation/common.validation');

const { addProductValidation, updateProductValidation } = require("../validation/products.validation");

const { checkSession } = require("../../../config/sessionAuth");

app.post("/addProduct", [checkSession, validator(addProductValidation)], addProduct);

app.post("/updateProduct/:id", [checkSession, validator(updateProductValidation)], updateProduct);

app.post("/deleteProduct/:id", checkSession, deleteProduct);

app.get("/getAllProducts", checkSession, getAllProducts);
app.get("/getProductById/:id", checkSession, getProductById);

app.get("/topRatedProducts", checkSession, topRatedProducts);
app.get("/storeTopRatedProducts/:storeId", checkSession, storeTopRatedProducts);
app.get("/storeProducts/:storeId", checkSession, storeProducts);
app.get("/productsByStoreAndCategory/:storeId/:categoryId", checkSession, productsByStoreAndCategory);
app.get("/productSearch", checkSession, productSearch);

module.exports = app;
