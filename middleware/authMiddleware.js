const jwt = require('jsonwebtoken');
const RBAC_User = require('../models/user');

const authMiddleware = async(req, res, next) => {
    try { const authHeader = req.headers['authorization'];
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message: "Authorization token in missing damnit!!"});
    }
    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await RBAC_User.findById(decoded.id).select('-password');

    if(!user){
        return res.status(401).json({message: "User not Found!!"});
    }

    req.user = user;

    next();
    }
    catch(err){
        console.error("Authorization middleware Error: ", err.message);
        return res.status(403).json({message: "token Expired or not found!!"});
    }
}

module.exports = authMiddleware;