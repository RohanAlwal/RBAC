const Permission = require('../models/permission')
const mongoose = require('mongoose');
const Role = require('../models/role');
const RBAC_User = require('../models/user');

const createPermission = async(req, res) => {
    try{
        const { name } = req.body
        const isExists = await Permission.findOne({ name });
        if(isExists){
            return res.status(400).json({message: "Permission Already Exists!!"})
        }
        const permission = new Permission({ name });
        await permission.save();
        return res.status(201).json({message: "Permission Created!!", permission});
    }
    catch(err){
        console.error("Error Creating Permission: ", err.message);
        return res.status(500).json({message: "Server Error!!"});
    }
}

const createRole = async(req, res) => {
    try{
        const { name, permissionIds } = req.body;
        if(!name || typeof name !== 'string' || name.trim() === ''){
            return res.status(400).json({message: "Role name is required and must be a non empty string !!"});
        }
        if(!Array.isArray(permissionIds) || permissionIds.length === 0){
            return res.status(400).json({message: "Permission id length is not matched and should be array!!"});
        }

        const isValidObjectId = (id) => {
            return mongoose.Types.ObjectId.isValid(id);
        }
        const invalidIds = permissionIds.filter(id => !isValidObjectId(id));
        if(invalidIds.length > 0){
            return res.status(400).json({ message: "One or more permissionIds are invalid MongoDB ObjectIds." });
        }

        const existingRole = await Role.findOne({ name });
        if(existingRole){
            return res.status(400).json({message: "Role Already Exists!!"});
        }

        const permissions = await Permission.find({_id: {$in: permissionIds}});
        if(permissions.length !== permissionIds.length){
            return res.status(400).json({message: "One or more permissions are invalid or do not exists!!"});
        }

        const role = new Role({
            name: name.trim(),
            permissions: permissionIds,
        });

        await role.save();

        const newRole = await Role.findById(role._id).populate('permissions');
        return res.status(201).json({message: "Role create Successfully!!", role: newRole});

    }
    catch(err){
        console.error("Error creating Role: ", err.message);
        return res.status(500).json({message: "Server Error!!"});
    }
}

const assignRoleToUser = async(req, res) => {
    try{
        const { userId, roleId } = req.params
        if(!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(roleId)){
            return res.status(400).json({message: "Invalid userId or roleId!!"});
        }
        const user = await RBAC_User.findById({userId});
        if(!user){
            return res.status(400).json({message: "User with the id not found!!"});
        }
        const role = await RBAC_User.findById({roleId});
        if(!role){
            return res.status(400).json({message: "User with the id not found!!"});
        }

        const hasRole = user.roles.map(id => id.toString()).includes(roleId.toString());
        if(hasRole){
            return res.status(400).json({message: "User Already has this kind of role!!"});
        }
        user.roles.push(roleId);
        await user.save();

        return res.status(200).json({message: "Role assigned to the user!!"});

    } 
    catch(err){
        console.error("Error Assigning Role: ", err.message);
        return res.status(500).json({message: "Server Error!!"});
    }
}

const removeRoleFromUser = async(req, res) => {
    try{

        const { userId, roleId } = req.params

        if(!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(roleId)){
            return res.status(401).json({message: "Invalid userId or roleId!!"});
        }

        const user = await RBAC_User.findById({userId});
        if(!user){
            return res.status(400).json({message: "User with the id not found!!"});
        }
        const role = await RBAC_User.findById({roleId});
        if(!role){
            return res.status(400).json({message: "User with the id not found!!"});
        }

        const hasRole = user.roles.map(id => id.toString()).includes(roleId.toString());
        if(!hasRole){
            return res.status(400).json({message: "Role Doesn't even exists!!"});
        }

        user.roles.pull(roleId);
        await user.save();

        return res.status(200).json({message: "Role removed From user!!"});

    } 
    catch(err){
        console.error("Error Removing Role From the user: ", err.message);
        return res.status(500).json({message: "Server Error!!"});
    }
}

module.exports = { createPermission, createRole, assignRoleToUser, removeRoleFromUser };