const joi = require('joi');

module.exports = {
    addStoreValidation: {
        body: joi.object().required().keys({
            storeName: joi.string().empty('').required().messages({
                "string.empty": "You have to enter store name",
                "any.required": "You have to enter store name"
            }),
            storeWebsite: joi.string().empty('').required().messages({
                "string.empty": "You have to enter store website",
                "any.required": "You have to enter store website"
            }),
            telephoneNumbers: joi.alternatives().required().try(
                joi.number().required().messages({
                    "any.required": "You have to enter at least one telephone number"
                })
                , joi.array().min(1).required().items(joi.number().required().messages({
                    
                    "any.required": "You have to enter at least one telephone number"
                })).messages({
                    "array.min": "You have to enter at least one telephone number"
                })).messages({
                    "any.required": "You have to enter at least one telephone number"
                }),

            storeCategories: joi.alternatives().required().try(
                joi.string().empty('').required().messages({
                    "any.required": "You have to enter at least one category",
                    "string.empty": "You have to enter at least one category"
                })
                , joi.array().required().min(1).items(joi.string().empty('').required().messages({
                    "any.required": "You have to enter at least one category",
                    "string.empty": "You have to enter at least one category"
                })).messages({
                    "array.includesRequiredUnknowns": "You have to enter at least one category",
                    "array.min": "You have to enter at least one category"
                })).messages({
                    "any.required": "You have to enter at least one category"
                }),
            canBeAddedToCart: joi.optional().messages({
                "string.empty": "You have to enter a boolean value",
            }),
            isComparable: joi.optional().messages({
                "string.empty": "You have to enter a boolean value",
            }),
        })
    },
    updateStoreValidation: {
        body: joi.object().required().keys({
            storeName: joi.string().empty('').optional().messages({
                "string.empty": "You have to enter store name"
            }),
            telephoneNumbers: joi.alternatives().optional().try(
                joi.number().messages({
                    
                    "any.required": "You have to enter at least one telephone number"
                })
                , joi.array().min(1).required().items(joi.number().required().messages({
                    
                    "any.required": "You have to enter at least one telephone number"
                })).messages({
                    "array.min": "You have to enter at least one telephone number"
                })),
            storeWebsite: joi.string().empty('').required().messages({
                "string.empty": "You have to enter store website",
                "any.required": "You have to enter store website"
            }),
            storeCategories: joi.alternatives().optional().try(
                joi.string().empty('').optional().messages({
                    "string.empty": "You have to enter at least one category"
                })
                , joi.array().optional().min(1).items(joi.string().empty('').required().messages({
                    "string.empty": "You have to enter at least one category"
                })).messages({
                    "array.includesRequiredUnknowns": "You have to enter at least one category",
                    "array.min": "You have to enter at least one category"
                })),
            canBeAddedToCart: joi.optional().messages({
                "string.empty": "You have to enter a boolean value",
            }),

            isComparable: joi.optional().messages({
                "string.empty": "You have to enter a boolean value",
            }),

        })
    }
}
