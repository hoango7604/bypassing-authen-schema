const Joi = require('joi')

module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schema)

            // Handle error occur
            if (result.error) {
                return res.status(400).json(result.error)
            }

            // Handle validated value
            if (!req.value) {
                req.value = {}
            }
            req.value['body'] = result.value
            next()
        }
    },

    schemas: {
        authenticateSchema: Joi.object().keys({
            username: Joi.string().required(),
            password: Joi.string().required(),
        }),

        authorizeSchema: Joi.object().keys({
            username: Joi.string().required(),
            password: Joi.string().required()
        })
    }
}