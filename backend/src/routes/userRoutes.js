const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');
const { registerValidation, loginValidation } = require('../validations/user.validation');
const {validate} =  require('../middlewares/validator');

router.post('/login', loginValidation, validate, ctrl.loginUser);
router.post('/register', registerValidation, validate, ctrl.registerUser);

module.exports = router;
    