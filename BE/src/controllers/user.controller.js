const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const userModel = require('../models/user.model')

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
    }, process.env.JWT_SECRET)

    // token stored in "token"
    res.cookie("token", token)

    res.status(201).json({message: "user registration sucessfull",
        user: {id: user.id, role: user.role} // this will disply user's id and role in json format while testing
    })
}
module.exports = {registerUser}