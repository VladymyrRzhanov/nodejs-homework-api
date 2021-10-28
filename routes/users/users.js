const express = require('express')
const router = express.Router();
const { SignUpValidate, SignInValidate, UserUpdateSubscriptionValidate } = require('../../validation/usersValidation');


const { signUp, signIn, signOut, getCurrentUser, updateUserSubscription, uploadAvatar } = require('../../controllers/users.controllers');
const guard = require('../../helpers/guard');
const limiter = require('../../helpers/rate-limit');
const upload = require('../../helpers/uploads');


router.post('/signup', SignUpValidate, signUp);
router.post('/signin', SignInValidate, limiter, signIn);
router.post('/signout', guard, signOut);
router.get('/current', guard, getCurrentUser);
router.patch('/', guard, UserUpdateSubscriptionValidate, updateUserSubscription);
router.patch('/avatars', guard, upload.single('avatar'), uploadAvatar);

module.exports = router;
