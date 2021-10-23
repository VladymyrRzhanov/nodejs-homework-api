const express = require('express')
const router = express.Router();
const { SignUpValidate, SignInValidate, UserUpdateSubscriptionValidate } = require('../../validation/usersValidation');


const { signUp, signIn, signOut, getCurrentUser, updateUserSubscription } = require('../../controllers/users.controllers');
const guard = require('../../helpers/guard');
const limiter = require('../../helpers/rate-limit');


router.post('/signup', SignUpValidate, signUp);
router.post('/signin', SignInValidate, limiter, signIn);
router.post('/signout', guard, signOut);
router.get('/current', guard, getCurrentUser);
router.patch('/', guard, UserUpdateSubscriptionValidate, updateUserSubscription);

module.exports = router;
