const Store = require("../model/stores.model");
const User = require("../../users/model/users.model");
const Category = require("../../categories/model/categories.model");
const fs = require('fs');
const path = require('path');
const uploadFolder = path.join(__dirname, "../../../uploads/stores");


const addStore = async (req, res) => {

    let { storeName, telephoneNumbers, storeWebsite, storeCategories, canBeAddedToCart, isComparable } = req.body;
    if (canBeAddedToCart == "on") canBeAddedToCart = true; else canBeAddedToCart = false;
    if (isComparable == "on") isComparable = true; else isComparable = false;
    try {
        if (req.files || Object.keys(req.files).length === 1) {
            const store = await Store.findOne({ storeName: storeName });
            if (store) {
                
                res.render("error.ejs", {error: "This store already exists", admin: req.session.admin })
            }
            else {
                let storeImage = req.files.storeImage
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const buffer = Buffer.from(storeImage.data, "base64");
                fs.writeFileSync(path.join(uploadFolder, uniqueSuffix + '-' + storeImage.name), buffer);
                let newStore = new Store({
                    storeName, telephoneNumbers, storeWebsite, storeCategories, canBeAddedToCart, isComparable,
                    storeLogoURL: path.join('uploads/stores', uniqueSuffix + '-' + storeImage.name)
                });
                await newStore.save();
                res.redirect("/renderStores")
            }
        }
        else {
            
            res.render("error.ejs", {error: "You have to enter store image", admin: req.session.admin })
        }
    } catch (error) {
        
        res.render("error.ejs", {error: "Something went wrong", admin: req.session.admin })
    }
}


const updateStore = async (req, res) => {
    // console.log(req.body);
    let { storeName, telephoneNumbers, storeWebsite, storeCategories, canBeAddedToCart, isComparable, storeLogoURL } = req.body;
    const { id } = req.params;
    const storeNameTaken = await Store.findOne({ storeName });
    const store = await Store.find({ _id: id }).catch(error => { return });

    if (canBeAddedToCart == "on") canBeAddedToCart = true; else canBeAddedToCart = false;
    if (isComparable == "on") isComparable = true; else isComparable = false;

    if (store.length == 0) {
        
        res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin })
    }
    else if (storeNameTaken && storeNameTaken._id != store._id) {
        res.render("error.ejs", {error: "This store already exists", admin: req.session.admin })
    }
    else if (store.lenght == 0 && storeNameTaken) {
        res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin })
    }
    else {
        if (req.files) {
            let storeImage = req.files.storeImage
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const buffer = Buffer.from(storeImage.data, "base64");
            fs.writeFileSync(path.join(uploadFolder, uniqueSuffix + '-' + storeImage.name), buffer);
            await Store.findByIdAndUpdate({ _id: id }, {
                storeName, telephoneNumbers, storeWebsite, storeCategories, canBeAddedToCart, isComparable,
                storeLogoURL: path.join('uploads/stores', uniqueSuffix + '-' + storeImage.name)
            })
                .then(re => {
                    res.redirect("/viewStores")
                })
                .catch(error => {
                    if (error.name == "CastError") {
                        res.json({ status: 400, message: "Please enter a valid id", error })
                    }
                    else {
                        res.render("error.ejs", {error: "Something went wrong", admin: req.session.admin })
                    }
                })
        }
        else if (!req.files) {
            await Store.findByIdAndUpdate({ _id: id }, {
                storeName, telephoneNumbers, storeWebsite, storeCategories, canBeAddedToCart, isComparable,
                storeLogoURL: store.storeLogoURL
            }).then(re => res.redirect("/viewStores"))
                .catch(error => {
                    if (error.name == "CastError") {

                        res.json({ status: 400, message: "Please enter a valid id", error })
                    }
                    else {
                        res.render("error.ejs", {error: "Something went wrong", admin: req.session.admin })
                    }
                })
        }
    }
}


const deleteStore = async (req, res) => {
    const { id } = req.params;
    const store = await Store.findById({ _id: id }).catch(error => error => { return });
    if (!store) {
        res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin })
    }
    else {
        let img;
        try {
            fs.readFileSync(store.storeLogoURL);
            img = true;

        } catch (err) {
            img = false
        }

        if (img) fs.unlinkSync(store.storeLogoURL);

        await Store.findByIdAndDelete({ _id: id })
            .then(re => res.redirect("/viewStores"))
            .catch(error => {
                if (error.name == "CastError") {
                    res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin })
                }
                else {
                    res.render("error.ejs", {error: "Something went wrong", admin: req.session.admin })
                }
            })
    }
}


const getAllStores = async (req, res) => {
    let { page, size } = req.query;
    if (!page) {
        page = 1
    }
    if (!size) {
        size = 10
    }
    const limit = parseInt(size);
    const skip = (page - 1) * limit;
    try {
        const allStores = await Store.find({}).select("-storeCategories");
        const totalRes = await Store.count();
        const totalPages = Math.ceil(totalRes / limit);
        res.render("stores/viewStores.ejs", { allStores, admin: req.session.admin })
    } catch (error) {
        res.render("error.ejs", {error: "Something went wrong", admin: req.session.admin })
    }
}


const getStores = async () => {
    try {
        const allStores = await Store.find({}).select("-storeCategories");
        return allStores;
    } catch (error) {
        res.render("error.ejs", {error: "Something went wrong", admin: req.session.admin })
    }
}


const getStoreCategories = async (req, res) => {
    let { page, size } = req.query;
    let { id } = req.params;
    const storeFound = await Store.find({ _id: id }).catch(error => { return });
    if (storeFound) {
        if (!page) {
            page = 1
        }
        if (!size) {
            size = 10
        }
        const limit = parseInt(size);
        const skip = (page - 1) * limit;
        try {
            const allStoreCategories = await Store.find({ _id: id }).select("storeCategories").populate('storeCategories').limit(limit).skip(skip);
            const storeCategories = allStoreCategories[0].storeCategories;
            const totalRes = await storeCategories.length;
            const totalPages = Math.ceil(totalRes / limit);
            res.send({ status: 200, message: "Success", totalRes, totalPages, storeCategories });
        } catch (error) {
            res.render("error.ejs", {error: "Something went wrong", admin: req.session.admin })
        }
    }
    else {
        res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin });
    }
}


const getStoreById = async (req, res) => {
    let { id } = req.params;
    const storeFound = await Store.find({ _id: id }).catch(error => { return });
    if (storeFound) {
        try {
            const store = await Store.find({ _id: id })
            const allCategories = await Category.find({})

            res.render("stores/updateStore.ejs", { store: store[0], allCategories, admin: req.session.admin });
        } catch (error) {
            res.render("error.ejs", {error: "Something went wrong", admin: req.session.admin })
        }
    }
    else {
        res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin })
    }
}


const recentStores = async (req, res) => {
    try {
        const allStoresCount = await Store.count();
        if (allStoresCount > 0) {
            const recentStores = await Store.find({}).limit(5).skip(allStoresCount - 5);
            return recentStores
        } else {
            res.send({ status: 200, message: "There is no stores yet!" });
        }
    } catch (error) {

        res.render("error.ejs", {error: "Something went wrong", admin: req.session.admin })
    }
}


const countUsersCategoriesStores = async (req, res) => {
    try {
        const allStoresCount = await Store.count();
        const allUersCount = await User.count();
        const allCategoriesCount = await Category.count();
        let count = { allStoresCount, allUersCount, allCategoriesCount }
        return count;
    } catch (error) {
        res.render("error.ejs", {error: "Something went wrong", admin: req.session.admin })
    }
}


module.exports = {
    addStore,
    updateStore,
    deleteStore,
    getAllStores,
    getStoreCategories,
    getStoreById,
    recentStores,
    getStores,
    countUsersCategoriesStores
}
