const express = require('express')
const authController = require('../controllers/user.controller');
const {registerUserValidation, loginUserValidation} = require('../middlewares/validation.middleware');

const router = express.Router();

router.post('/register', registerUserValidation, authController.registerUser); // first registerUserValidation will be called
router.post('/login', loginUserValidation, authController.loginUser);
router.post('/logout', authController.logoutUser)
router.post('/refresh-token', authController.refreshToken)

module.exports = router