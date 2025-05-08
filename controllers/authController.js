const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const RBAC_User = require('../models/user');

const registerUser = async(req, res) => {
    try{
        const {username, email, password} = req.body;
        const existingMail = await RBAC_User.findOne({email});
        if(existingMail) return res.status(400).json({message: "User Already Exists!"});
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new RBAC_User({username, email, password:hashPassword});
        await newUser.save();
        res.status(201).json({message:"User Registered Successfully!"});

    } catch(err){
        console.error("Error in registerUser:", err);
        res.status(500).json({error:true, message:"Server Error!"});
    }
};

const loginUser = async(req, res) => {
    try{
        const {email, password} = req.body;
        const user = await RBAC_User.findOne({email});
        if(!user) return res.status(400).json({message:"Invalid Credentials!"});
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message:"Invalid Credentials!"});
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn : '1h'});
        res.json({token, user: {id:user._id, username:user.username, email:user.email}});
    } catch(err){
        console.error("Login error:", err); 
        return res.status(500).json({ error: true, message: "Server Error!" });
}
};

module.exports = {registerUser, loginUser};