const joi = require('joi');

module.exports = {
    addCategoryValidation: {
        body: joi.object().required().keys({
            categoryName: joi.string().pattern(new RegExp(/^[a-z &,.'-]+$/i)).required().messages({
                "string.empty": "You have to enter category name",
                "string.pattern.base": "Please enter a valid category name",
                "any.required": "You have to enter category name"
            })
        })
    },
    updateCategoryValidation: {
        body: joi.object().required().keys({
            categoryName: joi.string().pattern(new RegExp(/^[a-z &,.'-]+$/i)).required().messages({
                "string.empty": "You have to enter category name",
                "string.pattern.base": "Please enter a valid category name",
                "any.required": "You have to enter category name"
            })
        })
    }
}