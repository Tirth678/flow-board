const jwt = require('jsonwebtoken');
const orgModel = require('../models/org.model');

async function createOrg(req, res){
    // Try to get token from Authorization header first, then from cookies
    const authHeader = req.headers.authorization;
    let token = authHeader && authHeader.split(' ')[1];
    
    if(!token && req.cookies){
        token = req.cookies.token;
    }

    if(!token){
        return res.status(401).json({message: "Invalid access - no token provided"})
    }

  try{

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { orgName, description } = req.body;

    if (decoded.role !== 'user' && decoded.role !== 'admin'){
        return res.status(400).json({message: 'invalid login'})
    }

    if(!orgName){
        return res.status(409).json({message: "orgName is required"})
    }
    
    const org = await orgModel.create({
        orgName,
        description
    })
    res.status(201).json({message: "new organisation created!!",
        org: {
            id: org._id,
            orgName: org.orgName,
            description: org.description
        }
    })

  } catch(error){
    console.log('Token verification error:', error.message);
    res.status(401).json({message: "error in creating new organisation, come back later", error: error.message})
  }
}
module.exports = {createOrg}