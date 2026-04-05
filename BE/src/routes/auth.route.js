const express = require('express')
const authController = require('../controllers/user.controller');
const orgController = require('../controllers/org.controller')

// creating router for routing
const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser)
router.post('/invite',orgController.inviteUser)

module.exports = router