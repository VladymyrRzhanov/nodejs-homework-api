const HttpCodeRes = {
    SUCCESS: 200,
    SUCCESS_CREATE: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,
    SERVER_ERROR: 500
};

const SubscriptionType = {
    STARTER: "starter",
    PRO: "pro",
    BUSINESS: "business"
}

const Limiter = {
    LIMITER_MAX_REQUESTS: 3,
    LIMITER_TIME: 15 * 60 * 1000
};

const ExpressJsonParams = {
    LIMIT: 10000
}

module.exports = { HttpCodeRes, SubscriptionType, Limiter, ExpressJsonParams };