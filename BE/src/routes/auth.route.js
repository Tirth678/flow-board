const express = require('express')
const authController = require('../controllers/user.controller');
const {registerUserValidation, loginUserValidation} = require('../middlewares/validation.middleware');

const router = express.Router();

router.post('/register', registerUserValidation, authController.registerUser);
router.post('/login', loginUserValidation, authController.loginUser);
router.post('/logout', authController.logoutUser)

module.exports = router