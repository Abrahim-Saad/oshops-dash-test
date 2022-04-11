const jwt = require("jsonwebtoken");
const rbac = require("../rbac/rbac");

module.exports = (endPoint) => {
    return async (req, res, next) => {
        try {
            if (req.headers.authorization) {
                let bareToken = req.headers.authorization;
                let token = bareToken.split(" ")[1];
                var decoded = jwt.verify(token, process.env.SECRET_KEY);
                const isAllowed = await rbac.can(decoded.role, endPoint);
                req.user = decoded;
                if (isAllowed) {
                    next();
                }
                else {
                    res.render("error.ejs", {error: "unauthorized" });
                }
            }
            else if (!req.headers.authorization) {
                res.render("error.ejs", {error: "unauthorized" });
            }
        } catch (error) {
            if(error.message == "invalid signature"){
                res.render("error.ejs", {error: "unauthorized" });
            }
            else{
                res.render("error.ejs", {error: "Something went wrwong" });
            }
        }

    }
}