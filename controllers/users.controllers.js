const jwt = require('jsonwebtoken');
const path = require('path');
const mkdirp = require('mkdirp');
require('dotenv').config();
const Users = require('../repository/users');
const { HttpCodeRes } = require('../config/constants');
const UploadAvatarFile = require('../services/file-upload.service');
const EmailService = require('../services/email/service');
const { CreateSender } = require('../services/email/sender');
const { CustomError } = require('../helpers/customError');

const SECRET_KEY = process.env.JWT_SECRET_KEY;

const getCurrentUser = async (req, res, next) => {
    const user = await Users.findByEmail(req.user.email);
    try {
        return res.status(HttpCodeRes.SUCCESS).json({
            status: 'success',
            code: HttpCodeRes.SUCCESS,
            user: {
                email: user.email,
                subscription: user.subscription,
                avatarUrl: user.avatar
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

        const emailService = new EmailService(
            process.env.NODE_ENV,
            new CreateSender(),
        )
        const statusVerify = await emailService.sendVerifyEmail(
            newUser.email,
            newUser.verifyToken,
        )

        return res.status(HttpCodeRes.SUCCESS_CREATE).json({
            status: 'success',
            code: HttpCodeRes.SUCCESS_CREATE,
            user: {
                email: newUser.email,
                subscription: newUser.subscription,
                avatar: newUser.avatar
            }
        })
    } catch (error) {
        next(error)
    }
};

const signIn = async (req, res) => {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isValidPassword = await user?.isValidPassword(password);
    if (!user || !isValidPassword || !user?.verify) {
        throw new CustomError(HttpCodeRes.UNAUTHORIZED, 'Email or password is wrong');
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

const signOut = async (req, res, _next) => {
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

const uploadAvatar = async (req, res) => {
    const id = String(req.user._id);
    const file = req.file;
    const AVATARS_DIR = process.env.AVATARS_DIR;
    const destination = path.join(AVATARS_DIR, id);
    await mkdirp(destination);
    const uploadService = new UploadAvatarFile(destination);
    if (file?.path) {
        const avatarUrl = await uploadService.save(file, id);
        await Users.updateAvatar(id, avatarUrl);
        return res.status(HttpCodeRes.SUCCESS).json({
            status: 'success',
            code: HttpCodeRes.SUCCESS,
            user: {
                avatarUrl
            }
        });
    }
    throw new CustomError(HttpCodeRes.BAD_REQUEST, 'Missing field')
};

const verifyUser = async (req, res) => {
    const user = await Users.findUserByVerifyToken(req.params.verificationToken);
    if (user) {
        await Users.updateVerifyToken(user._id, true, null);
        return res.status(HttpCodeRes.SUCCESS).json({
            status: 'success',
            code: HttpCodeRes.SUCCESS,
            message: 'Verification successful'
        });
    }
    throw new CustomError(HttpCodeRes.NOT_FOUND, 'User not found')
};

const resendingVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = await Users.findByEmail(email);
    if (!user) {
        return res.status(HttpCodeRes.BAD_REQUEST).json({
            status: 'error',
            code: HttpCodeRes.BAD_REQUEST,
            message: "Not found"
        });
    }
    else if (user && !user?.verify) {
        const { email, verifyToken } = user;
        const emailService = new EmailService(
            process.env.NODE_ENV,
            new CreateSender(),
        )
        const statusVerify = await emailService.sendVerifyEmail(
            email,
            verifyToken,
        )
        return res.status(HttpCodeRes.SUCCESS).json({
            status: 'success',
            code: HttpCodeRes.SUCCESS,
            message: 'Verification email sent'
        });
    }
    throw new CustomError(HttpCodeRes.BAD_REQUEST, 'Verification has already been passed')
};

module.exports = {
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    updateUserSubscription,
    uploadAvatar,
    verifyUser,
    resendingVerifyEmail
}