const rateLimit = require("express-rate-limit");
const { HttpCodeRes, Limiter } = require('../config/constants');

const limiter = rateLimit({
    windowMs: Limiter.LIMITER_TIME, // 15 minutes
    max: Limiter.LIMITER_MAX_REQUESTS, // limit each IP to 100 requests per windowMs
    handler: (req, res, next) => {
        return res.status(HttpCodeRes.TOO_MANY_REQUESTS).json({
            status: 'error',
            code: HttpCodeRes.TOO_MANY_REQUESTS,
            message: 'Too many requests. Try again in 15 minutes'
        });
    }
});

module.exports = limiter;