const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true},
    roles: [{type: mongoose.Schema.Types.ObjectId, ref: 'Role'}]
});

module.exports = mongoose.model("RBAC_User", userSchema);