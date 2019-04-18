const express = require('express');
const router = express.Router();
const validation = require('./validation');
const userController = require('../controllers/userController')

router.get('/user/signup', userController.signUp);
router.post('/user', validation.validateUsers, userController.create);
router.get('/user/signin', userController.signInForm);
router.post('/user/signin', validation.validateUsers, userController.signIn);
router.get('/user/signout', userController.signOut);
router.get('/user/:id', userController.show);
router.get('/user/:id/payment', userController.payment);
router.post('/user/:id/upgrade', userController.upgradeUser);
router.post('/user/:id/downgrade', userController.downgradeUser);

module.exports = router;
