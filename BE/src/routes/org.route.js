const express = require('express');
const orgController = require('../controllers/org.controller')
const router = express.Router();

router.post('/create', orgController.createOrg)
router.get('/', orgController.getAllOrgs)
router.get('/:id', orgController.getOneOrg)
router.post('/:id/invite', orgController.sendEmail)
module.exports = router