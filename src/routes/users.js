const express = require('express');
const router = express.Router();
const validation = require('./validation');
const userController = require('../controllers/userController')

router.get('/user/signup', userController.signUp);
router.post('/user', validation.validateUsers, userController.create);
router.get('/user/signin', userController.signInForm);
router.post('/user/signin', validation.validateUsers, userController.signIn);

module.exports = router;
