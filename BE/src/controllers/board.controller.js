const boardModel = require('../models/board.model')
const userModel = require('../models/user.model');
const orgMemberModel = require('../models/orgMember.model');
const jwt = require('jsonwebtoken');

async function createBoard(req, res){
    try {
        // Step 1: Verify token
        const authHeader = req.headers.authorization;
        let token = authHeader && authHeader.split(' ')[1];
        
        if(!token && req.cookies){
            token = req.cookies.token;
        }

        if(!token){
            return res.status(401).json({message: "Invalid access - no token provided"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Step 2: Get data from request
        const {name, description} = req.body;
        const {orgId} = req.params;

        if(!name){
            return res.status(400).json({message: "board name is required"})
        }

        // Step 3: Check if user is a member of the org
        const membership = await orgMemberModel.findOne({
            orgId: orgId,
            userId: decoded.id
        })
        if(!membership){
            return res.status(403).json({message: "user is not a member of this organisation"})
        }

        // Step 4: Create the board
        const board = await boardModel.create({
            name,
            description,
            orgId,
            createdBy: decoded.id
        })

        res.status(201).json({message: "board created successfully", board})
    } catch(error) {
        console.error('Error creating board:', error.message);
        res.status(500).json({message: "error creating board", error: error.message})
    }
}

async function listBoards(req, res){
    try {
        // Step 1: Verify token
        const authHeader = req.headers.authorization;
        let token = authHeader && authHeader.split(' ')[1];
        
        if(!token && req.cookies){
            token = req.cookies.token;
        }

        if(!token){
            return res.status(401).json({message: "Invalid access - no token provided"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Step 2: Get org ID from params
        const {orgId} = req.params;

        // Step 3: Check if user is a member of the org
        const membership = await orgMemberModel.findOne({orgId, userId: decoded.id})
        if(!membership){
            return res.status(403).json({message: "not a member of this organisation"})
        }

        // Step 4: Get all boards in the org
        const boards = await boardModel.find({orgId})

        res.status(200).json({boards, message: "boards fetched successfully"})
    } catch(error) {
        console.error('Error listing boards:', error.message);
        res.status(500).json({message: "error fetching boards", error: error.message})
    }
}

async function deleteBoard(req, res){
    try {
        // Verify token
        const authHeader = req.headers.authorization;
        let token = authHeader && authHeader.split(' ')[1];
        
        if(!token && req.cookies){
            token = req.cookies.token;
        }

        if(!token){
            return res.status(401).json({message: "Invalid access - no token provided"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Step 2: Get board ID from params
        const {boardId} = req.params;

        //  Find the board
        const board = await boardModel.findById(boardId);
        if(!board){
            return res.status(404).json({message: "board not found"})
        }

        // Check if user is an admin of the org
        const membership = await orgMemberModel.findOne({orgId: board.orgId, userId: decoded.id})
        if(!membership || membership.role !== 'admin'){
            return res.status(403).json({message: "admin access is required to delete boards"})
        }

        // Delete the board
        const deletedBoard = await boardModel.findByIdAndDelete(boardId)
        if(!deletedBoard){
            return res.status(500).json({message: 'error in deleting board, try again later'})
        }

        res.status(200).json({message: 'board deleted successfully'})
    } catch(error) {
        console.error('Error deleting board:', error.message);
        res.status(500).json({message: "error deleting board", error: error.message})
    }
}

module.exports = {createBoard, listBoards, deleteBoard}