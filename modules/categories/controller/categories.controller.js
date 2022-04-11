const Category = require("../model/categories.model");
const fs = require('fs');
const path = require('path');
const uploadFolder = path.join(__dirname, "../../../uploads/categories")


const addCategory = async (req, res) => {
    const { categoryName } = req.body;
    try {
        if (req.files || Object.keys(req.files).length === 1) {
            const category = await Category.findOne({ categoryName: categoryName });
            if (category) {
                res.render("error.ejs", {error: "This category already exists", admin: req.session.admin })
            }
            else {
                let categoryImage = req.files.categoryImage
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const buffer = Buffer.from(categoryImage.data, "base64");
                fs.writeFileSync(path.join(uploadFolder, uniqueSuffix + '-' + categoryImage.name), buffer);
                let newCategory = new Category({ categoryName: categoryName, categoryImageURL: path.join('uploads/categories', uniqueSuffix + '-' + categoryImage.name) });
                await newCategory.save();
                res.redirect("/renderCategories")
            }
        }
        else {
            res.json({ status: 400, message: "You have to enter category image" })
        }
    } catch (error) {
        res.render("error.ejs", {error: "Something went wrong", admin: req.session.admin })
    }
}


const updateCategory = async (req, res) => {
    const { categoryName } = req.body;
    const { id } = req.params;
    const categoryNameTaken = await Category.findOne({ categoryName });
    const category = await Category.findById({ _id: id }).catch(error => { return });
    if (!category) {
         res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin })
    }
    else if (categoryNameTaken && categoryName != category.categoryName) {
        res.render("error.ejs", {error: "This category already exists", admin: req.session.admin })
    }
    else if (!category && categoryNameTaken) {
         res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin })
    }
    else {
        if (req.files) {
            let categoryImage = req.files.categoryImage
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const buffer = Buffer.from(categoryImage.data, "base64");
            fs.writeFileSync(path.join(uploadFolder, uniqueSuffix + '-' + categoryImage.name), buffer);
            fs.unlinkSync(category.categoryImageURL);
            await Category.findByIdAndUpdate({ _id: id }, { categoryName, categoryImageURL: path.join('uploads/categories', uniqueSuffix + '-' + categoryImage.name) })
                .then(re => {
                    res.redirect("/viewCategories")
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
        else if (categoryName && !req.files) {
            await Category.findByIdAndUpdate({ _id: id }, { categoryName: categoryName, categoryImageURL: category.categoryImageURL })
                .then(re => res.redirect("/viewCategories"))
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


const deleteCategory = async (req, res) => {
    const { id } = req.params;
    let img;
    const category = await Category.findById({ _id: id }).catch(error => error => { return });
    if (!category) {
         res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin })
    }
    else {

        try {
            fs.readFileSync(category.categoryImageURL);
            img = true;

        } catch (err) {
            img = false
        }

        if (img) fs.unlinkSync(category.categoryImageURL);

        await Category.findByIdAndDelete({ _id: id })
            .then(re => res.redirect("/viewCategories"))
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


const getAllCategories = async (req, res) => {
    try {
        const allCategories = await Category.find({});
        // res.send({status:200, message: "Success", allCategories });
        res.render("categories/viewCategories.ejs", { allCategories, admin: req.session.admin })

    } catch (error) {
        res.render("error.ejs", {error: "Something went wrong", admin: req.session.admin })
    }
}


const getCategories = async () => {
    try {
        const allCategories = await Category.find({});
        return allCategories;

    } catch (error) {
        return console.log("Error: " + error);
    }
}


const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findOne({ _id: id });
        // res.send({status:200, message: "Success", category });
        res.render("categories/updateCategory.ejs", { category, admin: req.session.admin })
    } catch (error) {
        res.render("error.ejs", {error: "Something went wrong", admin: req.session.admin })
    }
}


const recentCategories = async (req, res) => {
    try {
        const allCategoriesCount = await Category.count();
        const recentCategories = await Category.find({}).limit(5).skip(allCategoriesCount - 4);
        return recentCategories;
    } catch (error) {
        res.render("error.ejs", {error: "Something went wrong", admin: req.session.admin })
    }
}


module.exports = {
    addCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
    recentCategories,
    getCategoryById,
    getCategories
}
