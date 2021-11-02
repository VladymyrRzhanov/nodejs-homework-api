const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi);
const {HttpCodeRes,SubscriptionType} = require('../config/constants');

const schemaSignUpUser = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: true } }).required().error(new Error('Must be a valid email')),
    password: Joi.string().pattern(/[0-9a-zA-Z!@#$%^&*]{6,}/).required().error(new Error('Password must be at least 6 characters')),
    subscription: Joi.boolean().optional(),
});

const schemaSignInUser = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: true } }).required().error(new Error('Must be a valid email')),
    password: Joi.string().pattern(/[0-9a-zA-Z!@#$%^&*]{6,}/).required().error(new Error('Password must be at least 6 characters')),
});

const schemaResendingVerifyEmail = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: true } }).required().error(new Error('Missing required field email')),
});

const schemaUpdateUserSubscription = Joi.object({
    subscription: Joi.string().insensitive().valid(SubscriptionType.STARTER, SubscriptionType.PRO, SubscriptionType.BUSINESS).required().error(new Error('Subscription must be one of starter, pro, business'))
});

const validate = async (schema, obj, res, next) => {
    try {
        await schema.validateAsync(obj);
        next()
    } catch (err) {
        res.status(HttpCodeRes.BAD_REQUEST).json({
            status: 'error', code: HttpCodeRes.BAD_REQUEST,
            message: err.message
        });
    }
};

module.exports.SignUpValidate = async (req, res, next) => {
    return await validate(schemaSignUpUser, req.body, res, next)
};

module.exports.SignInValidate = async (req, res, next) => {
    return await validate(schemaSignInUser, req.body, res, next)
};

module.exports.UserUpdateSubscriptionValidate = async (req, res, next) => {
    return await validate(schemaUpdateUserSubscription, req.body, res, next)
};

module.exports.VerifyEmailValidate = async (req, res, next) => {
    return await validate(schemaResendingVerifyEmail, req.body, res, next)
};