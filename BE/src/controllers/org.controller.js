const jwt = require('jsonwebtoken');
const orgModel = require('../models/org.model');
const userModel = require('../models/user.model');
const orgMemberModel = require('../models/orgMember.model');
const { MailtrapClient } = require('mailtrap');
const OrgMember = require('../models/orgMember.model');
const config = require('../config/config')

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

    const decoded = jwt.verify(token, config.JWT_SECRET);

    const { orgName, description } = req.body;

    if (decoded.role !== 'user' && decoded.role !== 'admin'){
        return res.status(400).json({message: 'invalid login'})
    }

    if(!orgName){
        return res.status(409).json({message: "orgName is required"})
    }
    
    const org = await orgModel.create({
        orgName,
        description,
        createdBy: decoded.id // this is requird as in schema (user ID who created it)
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
};
async function inviteUser(req, res){
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

        const decoded = jwt.verify(token, config.JWT_SECRET);

        // Step 2: Get org ID from params and username from body
        const { orgId } = req.params;
        const { username } = req.body;

        if(!username){
            return res.status(400).json({message: "username is required"})
        }

        // Step 3: Find the user by username
        const user = await userModel.findOne({username});

        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        // Step 4: Check if org exists
        const org = await orgModel.findById(orgId);
        if(!org){
            return res.status(404).json({message: "Organisation not found"})
        }

        // Step 5: Check if user is already a member
        const existingMember = await orgMemberModel.findOne({
            orgId: orgId,
            userId: user._id
        });

        if(existingMember){
            return res.status(400).json({message: "User is already a member of this organisation"})
        }

        // Step 6: Add user to org
        const orgMember = await orgMemberModel.create({
            orgId: orgId,
            userId: user._id,
            username: user.username,
            role: 'user'
        });

        res.status(201).json({
            message: "User added to organisation successfully",
            member: {
                orgId: orgMember.orgId,
                userId: orgMember.userId,
                role: orgMember.role
            }
        })
    } catch (error) {
        console.error('Error inviting user:', error.message);
        res.status(500).json({message: "error adding user to organisation", error: error.message})
    }
};
async function listOrgUser(req, res){
    try {
        const found = await orgMemberModel.find({orgId: req.params.id})
        .populate('userId', 'username email')

        if(!found){
            return res.status(404).json({message: "cannot find any memebrs in your organisation"})
        }

        res.status(200).json({members: found, message: "members fetched successfully"})
    } catch (error) {
        res.status(500).json({message: "error in listing users try again later"})
    }
};
async function deleteOrgUser(req, res){
    try {
        const deletedMember = await orgMemberModel.findOneAndDelete({orgId: req.params.id, userId: req.params.userId})
        
        if(!deletedMember){
            return res.status(404).json({message: "member not found"})
        }

        res.status(200).json({message: "user removed from organisation successfully"})
    } catch (error) {
        res.status(500).json({message: "error removing user from organisation"})
    }
}
module.exports = {createOrg, getAllOrgs, getOneOrg, inviteUser, listOrgUser, deleteOrgUser}