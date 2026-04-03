const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

async function registerUser(req, res){
    const {email, username, fullName ,password, role="user"} = req.body;

    const userAlreadyExist = await userModel.findOne({
        $or:[
            {username},
            {email},
            {fullName}
        ]
    })
    if(userAlreadyExist){
        res.status(409).json({message: "User already exist"});
    }
}

// hashing logic
const hash = await bcrypt.hash(password, 10);

const user = await userModel.create({
    username, 
    email,
    fullName,
    passowrd: hash,
    role
})


// auth
const token = jwt.sign({
    id: user._id,
    role: user.role
}, process.env.JWT_SECRET)

res.cookie('token', token)

res.status(201).json({
    message: "user registration successful!!",
    user: {id: user.id, role: user.role},
    token,
})

module.exports = {registerUser}