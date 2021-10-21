const express = require('express')
const router = express.Router();

const { signUp, signIn, signOut } = require('../../controllers/users.controllers');
const guard = require('../../helpers/guard');


router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', guard, signOut);

module.exports = router;
