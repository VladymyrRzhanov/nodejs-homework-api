const express = require('express');
const router = express.Router();
const { SignUpValidate, SignInValidate, UserUpdateSubscriptionValidate, VerifyEmailValidate } = require('../../validation/usersValidation');


const { signUp, signIn, signOut, getCurrentUser, updateUserSubscription, uploadAvatar, verifyUser, resendingVerifyEmail } = require('../../controllers/users.controllers');
const guard = require('../../helpers/guard');
const limiter = require('../../helpers/rate-limit');
const upload = require('../../helpers/uploads');
const wrapError = require('../../helpers/errorHandler');


router.post('/signup', SignUpValidate, wrapError(signUp));
router.post('/signin', SignInValidate, limiter, wrapError(signIn));
router.post('/signout', guard, wrapError(signOut));
router.get('/current', guard, wrapError(getCurrentUser));
router.patch('/', guard, UserUpdateSubscriptionValidate, wrapError(updateUserSubscription));
router.patch('/avatars', guard, upload.single('avatar'), wrapError(uploadAvatar));

router.get('/verify/:verificationToken', wrapError(verifyUser));
router.post('/verify', VerifyEmailValidate, wrapError(resendingVerifyEmail));

module.exports = router;
