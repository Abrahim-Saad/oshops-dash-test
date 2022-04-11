//dashboard
const app = require("express").Router();
const { checkSession } = require("../../../config/sessionAuth")
const { loadHomePage, logout, getAllAdmins, getAdminById } = require("../controller/admins.controller")
const { getAllUsers } = require("../../users/controller/users.controller");
const { getAllAdvertisments } = require("../../advertisment/controller/advertisment.controller");
const { getAllCategories, getCategories } = require("../../categories/controller/categories.controller");
const { getAllStores, getStores } = require("../../stores/controller/stores.controller");
const { getAllProducts } = require("../../products/controller/products.controller")


app.get('/login', (req, res) => {
    res.render("login.ejs");
})

app.get('/', checkSession, loadHomePage)

app.get("/home", checkSession, loadHomePage);

app.get("/logout", logout);

app.get("/renderAdmins", checkSession, async (req, res) => {
    res.render("admins/addAdmin.ejs", { admin: req.session.admin })
})

app.get("/renderAdminPage/:id", checkSession, getAdminById)
app.get("/viewAdmins", checkSession, getAllAdmins)
app.get("/renderUsers", checkSession, getAllUsers)

app.get("/renderAds", checkSession, async (req, res) => {
    res.render("ads/addAds.ejs", { admin: req.session.admin })
})

app.get("/viewAds", checkSession, getAllAdvertisments);

app.get("/renderCategories", checkSession, async (req, res) => {
    res.render("categories/addCategory.ejs", { admin: req.session.admin })
})

app.get("/viewCategories", checkSession, getAllCategories)


app.get("/renderStores", checkSession, async (req, res) => {
    const allCategories = await getCategories();
    res.render("stores/addStore.ejs", { admin: req.session.admin, allCategories })
})

app.get("/viewStores", checkSession, getAllStores)


app.get("/renderProducts", checkSession, async (req, res) => {
    const allCategories = await getCategories();
    const allStores = await getStores();
    res.render("products/addProduct.ejs", { admin: req.session.admin, allCategories, allStores })
})

app.get("/viewProducts", checkSession, getAllProducts)

module.exports = app;