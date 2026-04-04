const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const userModel = require('../models/user.model')


// register new user
async function registerUser(req, res){
    // fetch this data
    const {username, email, password, role='user'} = req.body;

    // if user already exist
    const userAlreadyExist = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    if(userAlreadyExist){
        res.status(409).json({message: "User already exist"})
    }
    
    // hasing logic
    const hash = await bcrypt.hash(password, 10) // salt is 10

    const user = await userModel.create({
        username,
        email,
        password: hash,
        role
    })
    // token and cookie logic

    const token = jwt.sign({
        id: user._id,
        role: user.role,
    }, process.env.JWT_SECRET,
    
    {expiresIn: '10m'}
)

    // token stored in "token"
    res.cookie("token", token)

    res.status(201).json({message: "user registration sucessfull",
        user: {id: user.id, role: user.role} // this will disply user's id and role in json format while testing
    })
}


// login existing user
async function loginUser(req, res){
    try {
        const {username, email, password} = req.body;

        // if password dosent come in request
        if(!password){
            res.status(400).json({message: "password is required to login"})
        }

         const user = await userModel.findOne({
            $or: [ // any one matches user shall be logged in
                {username},
                {email}
            ]
        })
        // if user or user password not found
        if(!user){
            res.status(401).json({message: "invalid credintials"})
        }
        if(!user.password){
            res.status(500).json({message: "password not found"})
        }

        // is password valid?
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            res.status(401).json({message: "invalid password"})
        }

        // if everything success then assign a token
        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET);

        res.cookie("token", token)

        res.status(201).json({message: "user login sucessfull",
        user: {id: user.id, role: user.role},
        token // for testing purpose
    })

    } catch (error) {
        res.status(500).json({message: "there are some issues in login, come again later!"})
    }
}

// logout user
async function logoutUser(req, res){
    res.clearCookie('token');
    res.status(200).json({message: "logout successfull"})
}

// {
//     "username": "test4",
//     "email": "email@test4.com",
//     "password": "abcedede"
// }
module.exports = {registerUser, loginUser, logoutUser}