const joi = require('joi');

module.exports = {
    addAdvertismentValidation: {
        body: joi.object().required().keys({
            title: joi.string().required().messages({
                "string.empty": "You have to enter title",
                "any.required": "You have to enter title"
            }),
            
            isActive: joi.optional().default(false).messages({
                "boolean.base": "please enter a valid status"
            })
        })
    },
    updateAdvertismentValidation: {
        body: joi.object().required().keys({
            title: joi.string().required().messages({
                "string.empty": "You have to enter title",
                "any.required": "You have to enter title"
            }),
            
            isActive: joi.optional().default(false).messages({
                "boolean.base": "please enter a valid status"
            })
        })
    },
    
}