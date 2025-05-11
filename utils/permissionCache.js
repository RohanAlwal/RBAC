const Role = require('../models/role');
const rolePermissionsMap = new Map();

const loadPermissionsToCache = async () => {
    try {
        rolePermissionsMap.clear();

        const roles = await Role.find().populate('permissions');

        roles.forEach(role => {
            const permissionSet = new Set();
            role.permissions.forEach((permission) => {
                permissionSet.add(permission.name);
            });
            rolePermissionsMap.set(role._id.toString(), permissionSet);
        });
        console.log("Role-Permission cache loaded Successfully at: ", new Date().toISOString());
        for (let [roleId, perms] of rolePermissionsMap.entries()) {
    console.log(`Role ${roleId} => [${[...perms].join(', ')}]`);
}
    }
    catch(err){
        console.error("Failed to load Permission Cache!!!", err);
    }
};

const roleHasPermission = (roleId, permissionName) => {
    const permissions = rolePermissionsMap.get(roleId.toString());
    if(!permissions) return false;
    return permissions.has(permissionName);
};

module.exports = {
    rolePermissionsMap,
    loadPermissionsToCache,
    roleHasPermission
};