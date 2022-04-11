const Advertisment = require("../model/advertisment.model");
const fs = require('fs');
const path = require('path');
const uploadFolder = path.join(__dirname, "../../../uploads/advertisements")


const addAdvertisment = async (req, res) => {
    let { title, isActive } = req.body;
    if (isActive == "on") isActive = true;
    else isActive = false
    try {
        if (req.files || Object.keys(req.files).length === 1) {
           
            const advertisment = await Advertisment.findOne({ title: title });
            if (advertisment) {
                res.render("error.ejs", {error: "This ad already exists", admin: req.session.admin });
            }
            else {
                let advertismentImage = req.files.advertismentImage
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const buffer = Buffer.from(advertismentImage.data, "base64");
                fs.writeFileSync(path.join(uploadFolder, uniqueSuffix + '-' + advertismentImage.name), buffer)

                let newAdvertisment = new Advertisment({
                    title: title,
                    advertismentImageURL: path.join('uploads/advertisements', uniqueSuffix + '-' + advertismentImage.name),
                    isActive: isActive
                });
                await newAdvertisment.save();

                await res.redirect("/renderAds");


            }
        }
        else {
            res.render("error.ejs", {error: "You have to enter an ad image!", admin: req.session.admin });
        }
    } catch (error) {
        res.render("error.ejs", {error: "Something went wrong!", admin: req.session.admin });
    }
}


const updateAdvertisment = async (req, res) => {
    
    let { title, isActive } = req.body;
    const { id } = req.params;
    if(isActive == "on") isActive = true;
    else isActive = false;
    
    const titleTaken = await Advertisment.findOne({ title });
    const advertisment = await Advertisment.findById({ _id: id }).catch(error => { return });
    if (!advertisment) {
        res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin });
    }
    else if (!advertisment && titleTaken) {
         res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin })
    }
    else {
        if (req.files) {
            let advertismentImage = req.files.advertismentImage
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const buffer = Buffer.from(advertismentImage.data, "base64");
            fs.writeFileSync(path.join(uploadFolder, uniqueSuffix + '-' + advertismentImage.name), buffer);
            try{
                fs.readFileSync(advertisment.advertismentImageURL);
                img = true;
    
            }catch(err){
                img = false
            }
            
            if(img) fs.unlinkSync(advertisment.advertismentImageURL);
            await Advertisment.findByIdAndUpdate({ _id: id }, { title, advertismentImageURL: path.join('uploads/advertisements', uniqueSuffix + '-' + advertismentImage.name), isActive: isActive })
                .then(re => {
                    res.redirect("/viewAds");
                })
                .catch(error => {
                    if (error.name == "CastError") {
                         res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin })
                    }
                    else {
                        res.render("error.ejs", {error: "Something went wrong!", admin: req.session.admin })
                    }
                })
        }
        else if (title && !req.files) {
            await Advertisment.findByIdAndUpdate({ _id: id }, { title: title, advertismentImageURL: advertisment.advertismentImageURL, isActive: isActive })
                .then(re => res.redirect("/viewAds"))
                .catch(error => {
                    if (error.name == "CastError") {
                         res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin })
                    }
                    else {
                        res.render("error.ejs", {error: "Something went wrong!", admin: req.session.admin })
                    }
                })
        }
    }
}


const deleteAdvertisment = async (req, res) => {
    let img;
    const { id } = req.params;
    const advertisment = await Advertisment.findById({ _id: id }).catch(error => error => { return });
    if (!advertisment) {
         res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin })
    }
    else {
        try{
            fs.readFileSync(advertisment.advertismentImageURL);
            img = true;

        }catch(err){
            img = false
        }
        
        if(img) fs.unlinkSync(advertisment.advertismentImageURL);
        await Advertisment.findByIdAndDelete({ _id: id })
            .then(re => res.redirect("/viewAds"))
            .catch(error => {
                if (error.name == "CastError") {
                     res.render("error.ejs", {error: "Please enter a valid id", admin: req.session.admin })
                }
                else {
                    res.render("error.ejs", {error: "Something went wrong!", admin: req.session.admin })
                }
            })
    }
}


const getAllAdvertisments = async (req, res) => {
    let { page, size } = req.query;
    let totalRes;
    if (!page) {
        page = 1
    }
    if (size == undefined || !size) {
        size = totalRes;
    }
    const limit = Math.abs(parseInt(size));
    const skip = (page - 1) * limit;
    try {
        const allAds = await Advertisment.find({});
        totalRes = await Advertisment.count();
        const totalPages = Math.ceil(totalRes / limit);
        // res.send({ status: 200, message: "Success", totalRes, totalPages, allAdvertisments });
        res.render("ads/viewAds.ejs", {allAds, admin: req.session.admin})

    } catch (error) {
        res.render("error.ejs", {error: "Something went wrong!", admin: req.session.admin })
    }
}


const getAllActiveAdvertisments = async (req, res) => {
    try {
        const allActiveAdvertisments = await Advertisment.find({ isActive: true });
        res.send({ status: 200, message: "Success", allActiveAdvertisments });

    } catch (error) {
        res.render("error.ejs", {error: "Something went wrong!", admin: req.session.admin })
    }
}


const getAdvertismentById = async (req, res) => {
    const { id } = req.params;
    try {
        const ad = await Advertisment.findOne({ _id: id });
        res.render("ads/updateAd.ejs", { ad, admin : req.session.admin })
    } catch (error) {
        res.render("error.ejs", {error: "Something went wrong!", admin: req.session.admin })
    }
}


module.exports = {
    addAdvertisment,
    updateAdvertisment,
    deleteAdvertisment,
    getAllAdvertisments,
    getAdvertismentById,
    getAllActiveAdvertisments
}
