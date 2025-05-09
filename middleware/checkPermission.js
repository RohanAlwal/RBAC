const RBAC_User = require('../models/user');
const {logUnauthorizedAccess} = require('../utils/logger');

const checkPermission = (requiredPermission) => {
    return async(req, res, next) => {
        try{
            const user = await RBAC_User.findById(req.user._id)
            .populate({
                path: 'roles',
                populate: {
                    path: 'permissions',
                    model: 'Permission'
                }
            });

            if(!user){
                return res.status(404).json({message: "User not Found!!"});
            }

            const userPermissions = user.roles.flatMap(role => role.permissions.map(p => p.name));

            if(!userPermissions.includes(requiredPermission)){
                logUnauthorizedAccess(req.user._id, req.originalUrl, 'Insufficient Permission');
                return res.status(403).json({message: "Permission Denied!!"});
            }

            next();
        } 
        catch(err){
            console.error("Error in Permission Checking: ", err.message);
            return res.status(500).json({message: "Internal Server Error!!"});
        }
    }
}

module.exports = checkPermission;