const express = require('express')
const cardController = require('../controllers/card.controller');
const {verifyToken} = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/:boardId', verifyToken, cardController.createCard)
router.get('/:boardId/list', verifyToken, cardController.getCards)
router.patch('/:cardId/status', verifyToken, cardController.updateCardStatus)
router.delete('/:cardId', verifyToken, cardController.deleteCard)

module.exports = router
