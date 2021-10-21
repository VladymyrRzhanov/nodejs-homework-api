const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi);
const {HttpCodeRes} = require('../config/constants');

const schemaContact = Joi.object({
    name: Joi.string().replace(/\s/g, "").min(1).max(20).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    phone: Joi.string().pattern(/^(\+)?(\(\d{2,3}\) ?\d|\d)(([ \-]?\d)|( ?\(\d{2,3}\) ?)){5,12}\d$/).required(),
    favourite: Joi.boolean().optional(),
});

const schemaUpdateContact = Joi.object({
    name: Joi.string().replace(/\s/g, "").alphanum().min(1).max(20).optional(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).optional(),
    phone: Joi.string().pattern(/^(\+)?(\(\d{2,3}\) ?\d|\d)(([ \-]?\d)|( ?\(\d{2,3}\) ?)){5,12}\d$/).optional(),
    favourite: Joi.boolean().optional()
});

const schemaUpdateContactStatus = Joi.object({
    favourite: Joi.boolean()
});

const schemaContactId = Joi.object({
    id: Joi.objectId().required(),
});

const validate = async (schema, obj, res, next) => {
    try {
        await schema.validateAsync(obj);
        next()
    } catch (err) {
        res.status(400).json({
            status: 'error', code: HttpCodeRes.BAD_REQUEST,
            message: "Missing required name field"
        });
    }
};

module.exports.ContactValidate = async (req, res, next) => {
    return await validate(schemaContact, req.body, res, next)
};

module.exports.ContactUpdateValidate = async (req, res, next) => {
    return await validate(schemaUpdateContact, req.body, res, next)
};

module.exports.ContactUpdateStatusValidate = async (req, res, next) => {
    return await validate(schemaUpdateContactStatus, req.body, res, next)
};

module.exports.ContactIdValidate = async (req, res, next) => {
    return await validate(schemaContactId, req.params, res, next)
};