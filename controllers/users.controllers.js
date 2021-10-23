const Users = require('../repository/users');
const { HttpCodeRes } = require('../config/constants');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

const getCurrentUser = async (req, res, next) => {
    const user = await Users.findByEmail(req.user.email);
    try {
        return res.status(HttpCodeRes.SUCCESS).json({
            status: 'success',
            code: HttpCodeRes.SUCCESS,
            user: {
                email: user.email,
                subscription: user.subscription
            }
        });
    } catch (error) {
        next(error)
    }
}

const signUp = async (req, res, next) => {
    const { email, password, subscription } = req.body;
    const user = await Users.findByEmail(email);
    if (user) {
            return res.status(HttpCodeRes.CONFLICT).json({ status: 'error', code: HttpCodeRes.CONFLICT, message: 'Email in use' });
    }
    try {
        const newUser = await Users.create({ email, password, subscription });
        return res.status(HttpCodeRes.SUCCESS_CREATE).json({
            status: 'success',
            code: HttpCodeRes.SUCCESS_CREATE,
            user: {
                email: newUser.email,
                subscription: newUser.subscription
            }
        });
    } catch (error) {
        next(error)
    }
}

const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isValidPassword = await user?.isValidPassword(password);
    if (!user || !isValidPassword) {
        return res.status(HttpCodeRes.UNAUTHORIZED).json({
            status: 'error',
            code: HttpCodeRes.UNAUTHORIZED,
            message: 'Email or password is wrong'
        });
    }
    const id = user._id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
    await Users.updateToken(id, token);
    return res.status(HttpCodeRes.SUCCESS).json({
        status: 'success',
        code: HttpCodeRes.SUCCESS,
        token,
        user: { email: user.email, subscription: user.subscription }
    });
};

const signOut = async (req, res, next) => {
    const id = req.user._id;
    await Users.updateToken(id, null);
    return res.status(HttpCodeRes.NO_CONTENT).json({})
};

const updateUserSubscription = async (req, res, next) => {
    const id = req.user._id;
    const { subscription } = req.body;
    try {
        const updateUser = await Users.updateSubscription(id, subscription);
        return res.status(HttpCodeRes.SUCCESS).json({
            status: 'success',
            code: HttpCodeRes.SUCCESS,
            user: {
                email: updateUser.email,
                subscription: updateUser.subscription
            }
        });
    } catch (error) {
        next(error)
    }
}

module.exports = {
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    updateUserSubscription
}