const express = require('express')
const boardController = require('../controllers/board.controller');
const router = express.Router();

router.post('/:orgId', boardController.createBoard)
router.get('/:orgId', boardController.listBoards)
router.delete('/:boardId', boardController.deleteBoard)

module.exports = router