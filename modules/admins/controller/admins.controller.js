const Admin = require("../model/admins.model");
const bcrypt = require("bcrypt");
const saltRounds = 5;
const jwt = require("jsonwebtoken");
const recentStores = require("../../stores/controller/stores.controller")
const recentCategories = require("../../categories/controller/categories.controller")


const addAdmin = async (req, res) => {
    // console.log(req.body);
    const { firstName, lastName, userName, password, role } = req.body;
    try {
        const admin = await Admin.findOne({ userName });
        if (admin) {
            res.render("error.ejs", {error: "This username is already taken", admin: req.session.admin });
        }

        else {
            let newAdmin = new Admin({ firstName, lastName, userName, password, role });
            await newAdmin.save();
            // res.send({ status: 200, message: "Success" });
            res.redirect("/renderAdmins")
        }

    } catch (error) {
        res.render("error.ejs", {error, admin: req.session.admin });
        // res.json({ status: 500, message: "" })
    }
}


const adminSignIn = async (req, res) => {
    const { userName, password } = req.body;
    console.log(password);
    try {
        let admin = await Admin.findOne({ userName });
        if (!admin) {
            res.render("error.ejs", {error: "Please enter a valid username", admin: req.session.admin });
        }
        else {
            let match = await bcrypt.compare(password, admin.password);
            if (match) {
                let token = jwt.sign({ _id: admin._id, role: admin.role }, process.env.SECRET_KEY);

                let hour = 3600000 * 200;
                req.session.cookie.expires = new Date(Date.now() + hour);
                req.session.admin = admin;
                req.session.admin.token = token;
                res.redirect("/home")
            }
            else {
                
                res.render("error.ejs", {error: "This password is invalid", admin: req.session.admin });

            }
        }
    } catch (error) {
        res.render("error.ejs", {error: "Something went wrong", admin: req.session.admin });

    }
}


const updateAdmin = async (req, res) => {
    const { firstName, lastName, userName, password, role } = req.body;
    const { id } = req.params;
    
    let hashedPassword;
    const user = await Admin.findById({ _id: id }).catch(error => { return });
    if (password) {
        hashedPassword = await bcrypt.hash(password, saltRounds);
    }
    else {
        hashedPassword = user.password;
    }
    const userNameTaken = await Admin.findOne({ userName });
    const admin = await Admin.findById({ _id: id }).catch(error => { return });
    if (!admin) {
        res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin });
    }
    else if (userNameTaken && userName != user.userName) {
        res.render("error.ejs", {error: "This username is already taken", admin: req.session.admin });
    }
    else if (!admin && userNameTaken) {
        res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin });
    }
    else {
        await Admin.findByIdAndUpdate({ _id: id }, { firstName, lastName, userName, password: hashedPassword, role })
            .then(re => res.redirect("/viewAdmins"))
            .catch(error => {
                if (error.name == "CastError") {
                    res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin });
                }
                else {
                    res.render("error.ejs", {error: "Something went wrong!", admin: req.session.admin });
                }
            })
    }
}

const deleteAdmin = async (req, res) => {
    const { id } = req.params;
    const admin = await Admin.findById({ _id: id }).catch(error => { return });
    if (!admin) {
        res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin });
    }
    else {
        await Admin.findByIdAndDelete({ _id: id })
            .then(re => res.redirect("/viewAdmins"))
            .catch(error => {
                if (error.name == "CastError") {
                    res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin });
                }
                else {
                    res.render("error.ejs", {error: "Something went wrong", admin: req.session.admin });
                }
            })
    }
}


const getAllAdmins = async (req, res) => {
    let { page, size } = req.query;
    if (!page) {
        page = 1
    }
    if (!size) {
        size = 25
    }
    const limit = parseInt(size);
    const skip = (page - 1) * limit;
    try {
        const allAdmins = await Admin.find({}).select("-password").limit(limit).skip(skip);
        const totalRes = await Admin.count();
        const totalPages = Math.ceil(totalRes / limit);
        // res.send({ status: 200, message: "Success", totalRes, totalPages, allAdmins });
        res.render("admins/viewAdmins.ejs", { allAdmins, admin: req.session.admin })
    } catch (error) {
        res.render("error.ejs", {error: "Something went wrong!", admin: req.session.admin });
    }
}


const getAdminById = async (req, res) => {
    try {
        let { id } = req.params;
        const oldAdmin = await Admin.findOne({ _id: id }).select("-password");
        // res.send({ status: 200, message: "Success", admin });
        res.render("admins/updateAdmin.ejs", { oldAdmin, admin: req.session.admin })
    } catch (error) {
        res.render("error.ejs", {error: "Something went wrong!", admin: req.session.admin });
    }
}


const getCurrentAdmin = async (req, res) => {
    const userId = req.user._id;
    await Admin.findOne({ _id: userId }).select("-password")
        .then(userData => res.status(200).send({ message: "Success", userData }))
        .catch(error => res.render("error.ejs", {error: "Something went wrong!", admin: req.session.admin }))
}


//dashbord
const loadHomePage = async (req, res) => {
    if (req.session.admin) {
        let stores = await recentStores.recentStores()
        let counts = await recentStores.countUsersCategoriesStores()
        let categories = await recentCategories.recentCategories()
        let admin = req.session.admin
        res.render("home.ejs", { counts, stores, categories, admin })
    } else res.redirect("/login")


}


const logout = async (req, res) => {
    req.session.user = null;
    res.redirect("/login");
};


module.exports = {
    addAdmin,
    adminSignIn,
    updateAdmin,
    deleteAdmin,
    getAllAdmins,
    getAdminById,
    getCurrentAdmin,

    loadHomePage,
    logout
}
