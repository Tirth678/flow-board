const jwt = require('jsonwebtoken');

function verifyToken(req, res, next){
    // Get token from Authorization header or cookies
    const authHeader = req.headers.authorization;
    let token = authHeader && authHeader.split(' ')[1];
    
    if(!token && req.cookies){
        token = req.cookies.token;
    }

    if(!token){
        return res.status(401).json({message: "Invalid access - no token provided"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user to request
        next();
    } catch (error) {
        return res.status(403).json({message: "Invalid or expired token"});
    }
}

module.exports = {verifyToken}