const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');
const { registerValidation, loginValidation } = require('../validations/user.validation');
const {validate} =  require('../middlewares/validator');
const protect = require('../middlewares/auth.middleware');

router.post('/login', loginValidation, validate, ctrl.loginUser);
router.post('/register', registerValidation, validate, ctrl.registerUser);
router.get('/me', protect, ctrl.getUserProfile);


module.exports = router;
    