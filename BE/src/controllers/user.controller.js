const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/user.model')
const config = require('../config/config')


// register new user
async function registerUser(req, res){
    try {
        const {username, email, password, role='user'} = req.body;

        // if user already exist
        const userAlreadyExist = await userModel.findOne({
            $or:[
                {username},
                {email}
            ]
        })
        if(userAlreadyExist){
            return res.status(409).json({message: "User already exist"})
        }
        
        // hashing logic
        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
            email,
            password: hash,
            role
        })

        // Generate tokens
        const accessToken = jwt.sign({
            id: user._id,
            role: user.role,
        }, config.JWT_SECRET, {expiresIn: '15m'})

        const refreshToken = jwt.sign({
            id: user._id,
            role: user.role,
        }, config.JWT_SECRET, {expiresIn: '7d'})

        // Store refresh token in cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        })

        res.status(201).json({
            message: "user registration successful",
            user: {id: user._id, role: user.role},
            accessToken
        })
    } catch(error) {
        console.error('Registration error:', error.message);
        res.status(500).json({message: "error in registration", error: error.message})
    }
}


// login existing user
async function loginUser(req, res){
    try {
        const {username, email, password} = req.body;

        // if password doesn't come in request
        if(!password){
            return res.status(400).json({message: "password is required to login"})
        }

        const user = await userModel.findOne({
            $or: [
                {username},
                {email}
            ]
        })
        
        // if user not found
        if(!user){
            return res.status(401).json({message: "user not found in db"})
        }

        // is password valid?
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({message: "invalid password"})
        }

        // Generate tokens
        const accessToken = jwt.sign({
            id: user._id,
            role: user.role
        }, config.JWT_SECRET, {
            expiresIn: '15m'
        });

        const refreshToken = jwt.sign({
            id: user._id,
            role: user.role
        }, config.JWT_SECRET, {
            expiresIn: '7d'
        });

        // Store refresh token in httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        })

        res.status(200).json({
            message: "user login successful",
            user: {id: user._id, role: user.role},
            accessToken
        })

    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({message: "there are some issues in login, come again later!"})
    }
}

// logout user
async function logoutUser(req, res){
    res.clearCookie('refreshToken');
    res.status(200).json({message: "logout successful"})
}

async function refreshToken(req, res){
    try {
        const refreshTokenCookie = req.cookies.refreshToken;
        if(!refreshTokenCookie){
            return res.status(401).json({
                message: 'refresh token not found'
            })
        }

        const decoded = jwt.verify(refreshTokenCookie, config.JWT_SECRET)
        
        const accessToken = jwt.sign({
            id: decoded.id,
            role: decoded.role
        }, config.JWT_SECRET, {
            expiresIn: '15m'
        })

        // Generate new refresh token
        const newRefreshToken = jwt.sign({
            id: decoded.id,
            role: decoded.role
        }, config.JWT_SECRET, {
            expiresIn: '7d'
        })

        // Update refresh token cookie
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true, 
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            message: "access token generated successfully",
            accessToken
        })
    } catch(error) {
        console.error('Refresh token error:', error.message);
        res.status(403).json({message: "invalid or expired refresh token"})
    }
}


module.exports = {registerUser, loginUser, logoutUser, refreshToken}