const express = require('express');
const router = express.Router();
const ctrl = require('./user.controller.js');
const { registerValidation, loginValidation } = require('../../validations/user.validation.js');
const {validate} =  require('../../middlewares/validator.middleware.js');
const protect = require('../../middlewares/auth.middleware.js');

router.post('/login', loginValidation, validate, ctrl.loginUser);
router.post('/register', registerValidation, validate, ctrl.registerUser);
router.get('/me', protect, ctrl.getUserProfile);


module.exports = router;
    