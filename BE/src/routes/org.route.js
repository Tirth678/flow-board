const express = require('express');
const orgController = require('../controllers/org.controller')
const {verifyToken} = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/create', verifyToken, orgController.createOrg)
router.post('/:orgId/invite', verifyToken, orgController.inviteUser)
router.get('/', verifyToken, orgController.getAllOrgs)
router.get('/:id', verifyToken, orgController.getOneOrg)
router.get('/:id/members', verifyToken, orgController.listOrgUser)
router.delete('/:id/:userId', verifyToken, orgController.deleteOrgUser)
module.exports = router