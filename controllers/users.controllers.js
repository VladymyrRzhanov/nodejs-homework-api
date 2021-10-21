const Users = require('../repository/users');
const { HttpCodeRes } = require('../config/constants');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

const signUp = async (req, res, next) => {
    const { email, password, subscription } = req.body;
    const user = await Users.findByEmail(email);
    if (user) {
            return res.status(HttpCodeRes.CONFLICT).json({ status: 'error', code: HttpCodeRes.CONFLICT, message: 'Email is already exist' });
    }
    try {
        const newUser = await Users.create({ email, password, subscription });
        return res.status(HttpCodeRes.SUCCESS_CREATE).json({
            status: 'success',
            code: HttpCodeRes.SUCCESS_CREATE,
            data: {
                id: newUser.id,
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
    const isValidPassword = await user.isValidPassword(password);
    if (!user || !isValidPassword) {
        return res.status(HttpCodeRes.UNAUTHORIZED).json({
            status: 'error',
            code: HttpCodeRes.UNAUTHORIZED,
            message: 'Invalid credentials'
        });
    }
    const id = user._id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
    await Users.updateToken(id, token);
    return res.status(HttpCodeRes.SUCCESS).json({
        status: 'success',
        code: HttpCodeRes.SUCCESS,
        data: { token }
    });
};

const signOut = async (req, res, next) => {
    const id = req.user._id;
    await Users.updateToken(id, null);
    return res.status(HttpCodeRes.NO_CONTENT).json({})
}

module.exports = {
    signUp,
    signIn,
    signOut
}