const joi = require('joi');

module.exports = {
    addAdminValidation: {
        body: joi.object().required().keys({
            firstName: joi.string().pattern(new RegExp(/^[a-z ,.'-]+$/i)).required().messages({
                "string.empty": "You have to enter first name",
                "string.pattern.base": "Please enter a valid first name",
                "any.required": "You have to enter first name"
            }),
            lastName: joi.string().pattern(new RegExp(/^[a-z ,.'-]+$/i)).required().messages({
                "string.empty": "You have to enter last name",
                "string.pattern.base": "Please enter a valid last name",
                "any.required": "You have to enter last name"
            }),
            userName: joi.string().alphanum().min(4).max(25).required().messages({
                "string.empty": "You have to enter username",
                'string.min': "Username should have a minimum length of 4",
                'string.max': "Username should have a maximuim length of 25",
                "any.required": "You have to enter username"
            }),
            password: joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)).required().messages({
                "string.empty": "You have to enter password",
                "string.pattern.base": "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one special character and one number",
                "any.required": "You have to enter password"
            }),
            role: joi.string().pattern(new RegExp(/^[a-z ,.'-]+$/i)).required().messages({
                "string.empty": "You have to enter a role",
                "string.pattern.base": "Please enter a valid role",
                "any.required": "You have to enter a role"
            })
        })
    },
    updateAdminValidation: {
        body: joi.object().required().keys({
            firstName: joi.string().pattern(new RegExp(/^[a-z ,.'-]+$/i)).optional().messages({
                "string.empty": "You have to enter first name",
                "string.pattern.base": "Please enter a valid first name"
            }),
            lastName: joi.string().pattern(new RegExp(/^[a-z ,.'-]+$/i)).optional().messages({
                "string.empty": "You have to enter last name",
                "string.pattern.base": "Please enter a valid last name"
            }),
            userName: joi.string().alphanum().min(4).max(25).optional().messages({
                "string.empty": "You have to enter username",
                'string.min': "Username should have a minimum length of 4",
                'string.max': "Username should have a maximuim length of 25"
            }),
            password: joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)).empty('').optional().messages({
                "string.pattern.base": "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one special character and one number"
            }),
            role: joi.string().pattern(new RegExp(/^[a-z ,.'-]+$/i)).optional().messages({
                "string.empty": "You have to enter a role",
                "string.pattern.base": "Please enter a valid role"
            })
        })
    },
    adminSignInValidation: {
        body: joi.object().required().keys({
            userName: joi.string().empty('').alphanum().min(4).max(25).required().messages({
                "any.required": "You have to enter username",
                'string.min': "Username should have a minimum length of 4",
                'string.max': "Username should have a maximuim length of 25",
                "string.empty": "You have to enter username"
            }),
            password: joi.string().empty('').required().messages({
                "any.required": "You have to enter password",
            })
        })
    }
}