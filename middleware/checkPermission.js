const RBAC_User = require('../models/user');
const {logUnauthorizedAccess} = require('../utils/logger');
const { roleHasPermission  } = require('../utils/permissionCache')
const { setPermissionMemo, getPermissionMemo } = require('../utils/lruPermissionMemo');

const checkPermission = (requiredPermission) => {
    return async(req, res, next) => {
        try{

            const userId = req.user._id;
            const memoizedResult = getPermissionMemo(userId, requiredPermission);
            if(memoizedResult !== undefined){
                if(!memoizedResult){
                    logUnauthorizedAccess(userId, req.originalUrl, 'Cached: Insufficient Permission');
                    return res.status(403).json({ message: "Permission Denied!!" });
                }
                return next();
            }

            const user = await RBAC_User.findById(req.user._id).select('roles');

            if(!user){
                return res.status(404).json({message: "User not Found!!"});
            }

            const hasPermissions = user.roles.some(roleId => 
                roleHasPermission(roleId.toString(), requiredPermission)
            );

            setPermissionMemo(userId, requiredPermission, hasPermissions);

            if(!hasPermissions){
                logUnauthorizedAccess(req.user._id, req.originalUrl, 'Insufficient Permission');
                return res.status(403).json({ message: "Permission Denied!!" });
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