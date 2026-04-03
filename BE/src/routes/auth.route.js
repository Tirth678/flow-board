const express = require('express')
const authController = require('../controllers/user.controller');

// creating router for routing
const router = express.Router();

router.post('/register', authController.registerUser);


module.exports = router