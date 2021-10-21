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
    SERVER_ERROR: 500
};

const SubscriptionType = {
    STARTER: "starter",
    PRO: "pro",
    BUSINESS: "business"
}

module.exports = { HttpCodeRes, SubscriptionType };