const User = require("../model/users.model");
const bcrypt = require("bcrypt");
const saltRounds = 5;
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const fs = require('fs');
const path = require('path');
const uploadFolder = path.join(__dirname, "../../../uploads/users");


const signUp = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            res.render("error.ejs", {error: "This email already exists", admin: req.session.admin })
        }
        else {
            let newUser = new User({ firstName, lastName, email, password });
            await newUser.save();
            res.status(200).send({ message: "Success" });
        }
    } catch (error) {
        res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin })
    }
}


const userSignIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            res.render("error.ejs", {error: "Please enter a valid iemail", admin: req.session.admin })
        }
        else {
            let match = await bcrypt.compare(password, user.password);
            if (match) {
                let token = jwt.sign({ _id: user._id, role: user.role }, process.env.SECRET_KEY);
                res.status(200).json({ message: "Success", token });
            }
            else {
                res.render("error.ejs", {error: "Please enter a valid passsword", admin: req.session.admin })
            }
        }
    } catch (error) {
        res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin })
    }
}


const editUserProfile = async (req, res) => {
    const { firstName, lastName, email } = req.body;
    const id = req.user._id;
    const emailTaken = await User.findOne({ email });
    const user = await User.findById({ _id: id }).catch(error => { return });
    if (emailTaken) {
        res.status(500).json({ message: "This email already taken" });
    }
    else {
        if (req.files) {
            if (user.profilePictureURL == null) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                fs.writeFileSync(path.join(uploadFolder, uniqueSuffix + '-' + req.files.profilePictureURL.name), req.files.profilePictureURL.data);
                await User.findByIdAndUpdate({ _id: id }, { firstName, lastName, email, profilePictureURL: path.join('uploads/users', uniqueSuffix + '-' + req.files.profilePictureURL.name) })
                    .then(re => res.status(200).send({ message: "Success" }))
                    .catch(error => res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin }));
            }
            if (user.profilePictureURL != null) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                fs.writeFileSync(path.join(uploadFolder, uniqueSuffix + '-' + req.files.profilePictureURL.name), req.files.profilePictureURL.data);
                fs.unlinkSync(user.profilePictureURL);
                await User.findByIdAndUpdate({ _id: id }, { firstName, lastName, email, profilePictureURL: path.join('uploads/users', uniqueSuffix + '-' + req.files.profilePictureURL.name) })
                    .then(re => res.status(200).send({ message: "Success" }))
                    .catch(error => res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin }));
            }
        }
        else {
            await User.findByIdAndUpdate({ _id: id }, { firstName, lastName, email, profilePictureURL: user.profilePictureURL })
                .then(re => res.status(200).send({ message: "Success" }))
                .catch(error => res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin }));
        }
    }
}


const resetPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const id = req.user._id
    const user = await User.findById({ _id: id }).catch(error => { return });
    let match = await bcrypt.compare(oldPassword, user.password);
    if (match) {
        let hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        await User.findByIdAndUpdate({ _id: id }, { password: hashedPassword })
            .then(re => res.status(200).send({ message: "Success" }))
            .catch(error => res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin }));
    }
    else {
        res.status(400).json({ message: "Please enter a correct password" });
    }
}


const addAddress = async (req, res) => {
    const { address } = req.body;
    const id = req.user._id;
    await User.findByIdAndUpdate({ _id: id }, { address })
        .then(re => res.status(200).send({ message: "Success" }))
        .catch(error => res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin }));
}


const removeAddress = async (req, res) => {
    const id = req.user._id;
    await User.findByIdAndUpdate({ _id: id }, { address: null })
        .then(re => res.status(200).send({ message: "Success" }))
        .catch(error => res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin }));
}


const getAllUsers = async (req, res) => {
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
        const allUsers = await User.find({}).select("-password");
        const totalRes = await User.count();
        const totalPages = Math.ceil(totalRes / limit);
        // res.status(200).send({ message: "Success", totalRes, totalPages, allUsers });
        res.render("users/viewUsers.ejs", { allUsers, admin: req.session.admin })
    } catch (error) {
        res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin })
    }
}

const getCurrentUser = async (req, res) => {
    const userId = req.user._id;
    await User.findOne({ _id: userId }).select("-password").select("-role")
        .then(userData => res.status(200).send({ message: "Success", userData }))
        .catch(error => res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin }))
}


const sendOrder = async (req, res) => {
    const { storeEmail, userOrder, totalPrice, phoneNumber } = req.body;
    let order = ``;
    const userId = req.user._id;
    const user = await User.findOne({ _id: userId });
    try {
        console.log(userOrder.length);
        if (userOrder.length == undefined) {
            order = order + `<tr>
            <td style="border: 1px solid black; padding: 4px;">${userOrder.productName}</td>
            <td style="border: 1px solid black; padding: 4px;">${userOrder.productQuantity}</td>
            <td style="border: 1px solid black; padding: 4px;">${userOrder.productPrice} <span>AED</span></td>
            </tr>`
        }
        for (let i = 0; i < userOrder.length; i++) {
            order = order + `<tr>
            <td style="border: 1px solid black; padding: 4px;">${userOrder[i].productName}</td>
            <td style="border: 1px solid black; padding: 4px;">${userOrder[i].productQuantity}</td>
            <td style="border: 1px solid black; padding: 4px;">${userOrder[i].productPrice} <span>AED</span></td>
        </tr>`
        }
        if (user.address == null) {
            res.status(400).json({ message: "Please add an address before sending an order" });
        }
        else {
            let transporter = nodemailer.createTransport({
                host: "o-shop.online",
                secure: true,
                auth: {
                    user: "o-shop@o-shop.online",
                    pass: "Moh555$fo",
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            await transporter.sendMail({
                from: '<o-shop@o-shop.online>',
                to: `${storeEmail}`,
                subject: "OShops Order",
                html: `<div style="background-color: rgba(236, 236, 236); padding: 8px;">
                <h1 style="text-align: center; font-weight: bold;">OShops Order</h1>
                <p style="font-size: 21px; font-weight: 500;"><span style="font-weight: bolder; font-size: 23px;">Name : </span>
                    ${user.firstName} ${user.lastName}</p>
                <p style="font-size: 21px; font-weight: 500;"><span style="font-weight: bolder; font-size: 23px;">Email : </span>
                    ${user.email} </p>
                <p style="font-size: 21px; font-weight: 500;"><span style="font-weight: bolder; font-size: 23px;">Address : </span>
                    ${user.address}</p>
                <p style="font-size: 21px; font-weight: 500;"><span style="font-weight: bolder; font-size: 23px;">Phone Number :
                    </span> ${phoneNumber}</p>
                <p style="font-size: 21px; font-weight: 500;"><span style="font-weight: bolder; font-size: 23px;">Order : </span>
                </p>
                <table
                    style="text-align: center; border-collapse: collapse; padding: 3px; border: 1px solid black; width: 50%; text-align: center;">
                    <thead>
                        <tr style="border: 1px solid black;">
                            <th style="border: 1px solid black; padding: 4px;">Product</th>
                            <th style="border: 1px solid black; padding: 4px;">Quantity</th>
                            <th style="border: 1px solid black; padding: 4px;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order}
                    </tbody>
                </table>
            
                <p style="font-size: 21px; font-weight: 500;"><span style="font-weight: bolder; font-size: 23px;">Total price :
                    </span> ${totalPrice} <span>AED</span></p>
            </div>`
            },
                (error, infor) => {
                    if (error) res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin });
                    if (infor) res.status(200).send({ message: "Success" });
                });
        }
    } catch (error) {
        res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin });
    }
}


module.exports = {
    signUp,
    userSignIn,
    editUserProfile,
    resetPassword,
    addAddress,
    removeAddress,
    getAllUsers,
    getCurrentUser,
    sendOrder
}
