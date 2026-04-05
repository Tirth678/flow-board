const express = require('express');
const orgController = require('../controllers/org.controller')
const router = express.Router();

router.post('/create', orgController.createOrg)
router.post('/:orgId/invite', orgController.inviteUser)
router.get('/', orgController.getAllOrgs)
router.get('/:id', orgController.getOneOrg)
router.get('/:id/members', orgController.listOrgUser)
router.delete('/:id/:userId', orgController.deleteOrgUser)
module.exports = router