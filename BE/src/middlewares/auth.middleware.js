const jwt = require('jsonwebtoken')

async function authArtist(req, res, next){
    const token = req.cookies.token;

    if(!token){
        return res.status(409).json({message: "unauthrorized access"});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        

    } catch (error) {
        
    }
}