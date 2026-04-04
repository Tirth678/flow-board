const jwt = require('jsonwebtoken');
const orgModel = require('../models/org.model');
const { MailtrapClient } = require('mailtrap');

const mailtrap = new MailtrapClient({
  token: process.env.MAILTRAP_API_KEY, 
});

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


// fetch all orgs from db
async function getAllOrgs(req, res){
    const orgs = await orgModel
    .find() // find
    .limit(5) // limit upto 5 names to balance load
    .populate("orgName", "description") // arrange

    res.status(201).json({orgs: orgs,
        message: "all organisations fecthed successfully"
    })
}
async function getOneOrg(req, res){
    try {
        const { id } = req.params;
        
        const org = await orgModel.findById(id);

        if(!org){
            return res.status(404).json({message: "organisation not found"})
        }

        res.status(200).json({org: org,
            message: "organisation found"
        })
    } catch(error) {
        res.status(500).json({message: "error fetching organisation", error: error.message})
    }
}

async function sendEmail(req, res){
   
}
module.exports = {createOrg, getAllOrgs, getOneOrg, sendEmail}