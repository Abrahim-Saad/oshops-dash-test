module.exports = (schema) => {
    return (req, res, next) => {
        var validationResult = schema.body.validate(req.body);
        var validation = [];
        if (validationResult.error) {
            validation.push(validationResult.error.details[0].message);
        }
        if (validation.length) {
            res.render("error.ejs", {error: validation.join(), admin: req.session.admin });
            return;
        }
        next();
    }
}


