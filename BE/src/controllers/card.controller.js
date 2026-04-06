const boardModel = require('../models/board.model');
const orgMemberModel = require('../models/orgMember.model');
const cardModel = require('../models/card.model');
const jwt = require('jsonwebtoken');
const config = require('../config/config')

async function createCard(req, res){
    try {
        const authHeader = req.headers.authorization;
        let token = authHeader && authHeader.split(' ')[1];
            
        if(!token && req.cookies){
            token = req.cookies.token;
        }

        if(!token){
            return res.status(401).json({message: "Invalid access - no token provided"})
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);

        const {title, description} = req.body;
        const {boardId} = req.params

        if(!title){
            return res.status(400).json({message: "card title is required"})
        }

        const board = await boardModel.findById(boardId);
        if(!board){
            return res.status(404).json({message: "board not found"});
        }

        const membership = await orgMemberModel.findOne({
            orgId: board.orgId,
            userId: decoded.id
        });
        if(!membership){
            return res.status(403).json({message: 'not a member of this organisation'})
        }

        const card = await cardModel.create({
            title,
            description,
            boardId,
            createdBy: decoded.id
        })
        res.status(201).json({message: "card created successfully", card})
    } catch(error) {
        console.error('Error creating card:', error.message);
        res.status(500).json({message: "error creating card", error: error.message})
    }
}

async function getCards(req, res){
    try {
        const authHeader = req.headers.authorization;
        let token = authHeader && authHeader.split(' ')[1];

        if(!token && req.cookies){
            token = req.cookies.token
        }

        if(!token){
            return res.status(401).json({message: "Invalid access - no token provided"})
        }

        const decoded = jwt.verify(token, config.JWT_SECRET)

        const {boardId} = req.params;

        const board = await boardModel.findById(boardId);
        if(!board){
            return res.status(404).json({message: 'board not found'})
        }

        const membership = await orgMemberModel.findOne({
            orgId: board.orgId,
            userId: decoded.id
        });
        if(!membership){
            return res.status(403).json({message: "not a member of this organisation"})
        }

        const cards = await cardModel.find({boardId});
        res.status(200).json({cards, message: "cards fetched successfully"})
    } catch(error) {
        console.error('Error fetching cards:', error.message);
        res.status(500).json({message: "error fetching cards", error: error.message})
    }
}

async function updateCardStatus(req, res){
    try {
        const authHeader = req.headers.authorization;
        let token = authHeader && authHeader.split(' ')[1];

        if(!token && req.cookies){
            token = req.cookies.token
        }

        if(!token){
            return res.status(401).json({message: "Invalid access - no token provided"})
        }

        const decoded = jwt.verify(token, config.JWT_SECRET)

        const {cardId} = req.params
        const {status} = req.body

        if(!status){
            return res.status(400).json({message: "status is required"})
        }

        const card = await cardModel.findById(cardId);
        if(!card){
            return res.status(404).json({message: "card not found"})
        }

        card.status = status;
        const savedCard = await card.save();
        if(!savedCard){
            return res.status(500).json({message: "error in saving card, try again"})
        }

        res.status(200).json({message: "status updated successfully", card: savedCard})
    } catch(error) {
        console.error('Error updating card:', error.message);
        res.status(500).json({message: "error updating card", error: error.message})
    }
}

async function deleteCard(req, res){
    try {
        const authHeader = req.headers.authorization;
        let token = authHeader && authHeader.split(' ')[1];

        if(!token && req.cookies){
            token = req.cookies.token
        }

        if(!token){
            return res.status(401).json({message: "Invalid access - no token provided"})
        }

        const decoded = jwt.verify(token, config.JWT_SECRET)

        const {cardId} = req.params;

        const card = await cardModel.findById(cardId);
        if(!card){
            return res.status(404).json({message: "card not found"})
        }

        const board = await boardModel.findById(card.boardId);
        const membership = await orgMemberModel.findOne({
            orgId: board.orgId,
            userId: decoded.id
        });

        if(!membership || membership.role !== 'admin'){
            return res.status(403).json({message: 'admin access required to delete cards'})
        }

        const deletedCard = await cardModel.findByIdAndDelete(cardId);
        res.status(200).json({message: "card deleted successfully"})
    } catch(error) {
        console.error('Error deleting card:', error.message);
        res.status(500).json({message: "error deleting card", error: error.message})
    }
}

module.exports = {createCard, getCards, updateCardStatus, deleteCard}