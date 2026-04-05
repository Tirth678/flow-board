const express = require('express')
const boardController = require('../controllers/board.controller');
const {verifyToken} = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/:orgId', verifyToken, boardController.createBoard)
router.get('/:orgId/list', verifyToken, boardController.listBoards)
router.delete('/:boardId', verifyToken, boardController.deleteBoard)

module.exports = router