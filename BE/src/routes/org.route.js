const express = require('express');
const orgController = require('../controllers/org.controller')
const router = express.Router();

router.post('/create', orgController.createOrg)

module.exports = router