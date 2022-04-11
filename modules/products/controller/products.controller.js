const Product = require("../model/products.model");
const Store = require("../../stores/model/stores.model");
const Category = require("../../categories/model/categories.model");
const fs = require('fs');
const path = require('path');
const uploadFolder = path.join(__dirname, "../../../uploads/products");


const addProduct = async (req, res) => {

    let { productName, price, rate, inStock, topProduct, storeId, categoryId } = req.body;
    if (inStock == "on") inStock = true; else inStock = false;
    if (topProduct == "on") topProduct = true; else topProduct = false;
    try {
        if (req.files || Object.keys(req.files).length === 1) {
            let productImage = req.files.productImage
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const buffer = Buffer.from(productImage.data, "base64");
            fs.writeFileSync(path.join(uploadFolder, uniqueSuffix + '-' + productImage.name), buffer);
            let newProduct = new Product({
                productName, price, rate, inStock, topProduct, storeId, categoryId,
                productImageURL: path.join('uploads/products', uniqueSuffix + '-' + productImage.name)
            });
            await newProduct.save();
            res.redirect("/renderProducts")
        }
        else {
            res.render("error.ejs", {error: "You have to enter a product image", admin: req.session.admin })
            
        }
    } catch (error) {
        res.render("error.ejs", {error: "Something went wrong", admin: req.session.admin })
    }
}


const updateProduct = async (req, res) => {
    let { productName, price, rate, inStock, topProduct, storeId, categoryId } = req.body;
    const { id } = req.params;
    if (inStock == "on") inStock = true; else inStock = false;
    if (topProduct == "on") topProduct = true; else topProduct = false;
    const product = await Product.findById({ _id: id }).catch(error => { return });
    if (!product) {
        
        res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin })
    }
    else {
        if (req.files) {
            let productImage = req.files.productImage
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const buffer = Buffer.from(productImage.data, "base64");
            fs.writeFileSync(path.join(uploadFolder, uniqueSuffix + '-' + productImage.name), buffer);
            await Product.findByIdAndUpdate({ _id: id },
                { productName, price, rate, inStock, topProduct, storeId, categoryId, productImageURL: path.join('uploads/products', uniqueSuffix + '-' + productImage.name) })
                .then(re => {
                    res.redirect("/viewProducts");
                })
                .catch(error => {
                    if (error.name == "CastError") {
                        res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin })
                    }
                    else {
                        res.render("error.ejs", {error: "Something went wrong", admin: req.session.admin })
                    }
                })
        }
        else if (!req.files) {
            await Product.findByIdAndUpdate({ _id: id }, { productName, price, rate, inStock, topProduct, storeId, categoryId, productImageURL: product.productImageURL })
                .then(re =>  res.redirect("/viewProducts"))
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
}


const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById({ _id: id }).catch(error => error => { return });
    if (!product) {
        res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin })
    }
    else {
        let isUploaded = product.productImageURL.split("/")[0];
        if (isUploaded == "uploads") {
            fs.unlinkSync(product.productImageURL);
        }
        await Product.findByIdAndDelete({ _id: id })
            .then(re => res.redirect("/viewProducts"))
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


const getAllProducts = async (req, res) => {
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
        const allProducts = await Product.find({});
        const totalRes = await Product.count();
        const totalPages = Math.ceil(totalRes / limit);
        // res.send({ status: 200, message: "Success", totalRes, totalPages, allProducts });
        res.render("products/viewProducts.ejs", { allProducts, admin: req.session.admin })
    } catch (error) {
        res.render("error.ejs", {error: "Something went wrong", admin: req.session.admin })
    }
}


const getProductById = async (req, res) => {
    let { id } = req.params;
    const productFound = await Product.find({ _id: id }).catch(error => { return });
    if (productFound) {
        try {
            let product = await Product.find({ _id: id });
            const allStores = await Store.find({}).catch(error => { return });
            const allCategories = await Category.find({}).catch(error => { return });

            res.render("products/updateProduct.ejs", {
                admin: req.session.admin,
                product: product[0],
                productId: (product[0]._id).toString(),
                storeId: (product[0].storeId).toString(),
                categoryId: (product[0].categoryId).toString(),
                allStores, allCategories
            })
        } catch (error) {
            res.render("error.ejs", {error: "Something went wrong", admin: req.session.admin })
        }
    }
    else {
        res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin })
    }
}


const topRatedProducts = async (req, res) => {
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
        const allProducts = await Product.find({ topProduct: true }).limit(limit).skip(skip);
        const totalRes = allProducts.length;
        const totalPages = Math.ceil(totalRes / limit);
        res.send({ status: 200, message: "Success", totalRes, totalPages, allProducts });
    } catch (error) {
        res.render("error.ejs", {error: "Something went wrong", admin: req.session.admin })
    }
}


const storeTopRatedProducts = async (req, res) => {
    let { page, size } = req.query;
    const { storeId } = req.params;
    const storeFound = await Store.find({ _id: storeId }).catch(error => { return });
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
            const allProducts = await Product.find({ topProduct: true, storeId }).limit(limit).skip(skip);
            const totalRes = allProducts.length;
            const totalPages = Math.ceil(totalRes / limit);
            res.send({ status: 200, message: "Success", totalRes, totalPages, allProducts });
        } catch (error) {
            res.render("error.ejs", {error: "Something went wrong", admin: req.session.admin })
        }
    }
    else {
        res.json({ status: 400, message: "Please enter a valid store id" })
    }

}


const storeProducts = async (req, res) => {
    let { page, size } = req.query;
    const { storeId } = req.params;
    const storeFound = await Store.find({ _id: storeId }).catch(error => { return });
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
            const allProducts = await Product.find({ storeId }).limit(limit).skip(skip);
            const totalRes = allProducts.length;
            const totalPages = Math.ceil(totalRes / limit);
            res.send({ status: 200, message: "Success", totalRes, totalPages, allProducts });
        } catch (error) {
            res.render("error.ejs", {error: "Something went wrong", admin: req.session.admin })
        }
    }
    else {
        res.json({ status: 400, message: "Please enter a valid store id" })
    }

}


const productsByStoreAndCategory = async (req, res) => {
    let { page, size } = req.query;
    const { storeId, categoryId } = req.params;
    const storeFound = await Store.find({ _id: storeId }).catch(error => { return });
    const categoryFound = await Category.find({ _id: categoryId }).catch(error => { return });
    if (!storeFound) {
        res.json({ status: 400, message: "Please enter a valid store id" })
    }
    else if (!categoryFound) {
        res.json({ status: 400, message: "Please enter a valid category id" })
    }
    else if (storeFound && categoryFound) {
        if (!page) {
            page = 1
        }
        if (!size) {
            size = 10
        }
        const limit = parseInt(size);
        const skip = (page - 1) * limit;
        try {
            const allProducts = await Product.find({ status: 400, categoryId, storeId }).limit(limit).skip(skip);
            const totalRes = allProducts.length;
            const totalPages = Math.ceil(totalRes / limit);
            res.send({ status: 200, message: "Success", totalRes, totalPages, allProducts });
        } catch (error) {
            res.render("error.ejs", {error: "Something went wrong", admin: req.session.admin })
        }
    }
    else {
        res.render("error.ejs", {error: "Something went wrong", admin: req.session.admin })
    }
}


const productSearch = async (req, res) => {
    let { search } = req.query;
    try {
        const data = await Product.find({ productName: { $regex: search, $options: 'i' } }).limit(10).sort({ price: 1 });
        res.send({ status: 200, message: "Success", data });
    } catch (error) {
        res.render("error.ejs", {error: "Something went wrong", admin: req.session.admin })
    }
}


module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    topRatedProducts,
    storeTopRatedProducts,
    storeProducts,
    productsByStoreAndCategory,
    productSearch
}
