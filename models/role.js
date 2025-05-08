const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
    name: {type: String, required: true},
    permissions: [{type: mongoose.Schema.Types.ObjectId, ref:'Permission'}],
    inherits: [{type: mongoose.Schema.Types.ObjectId, ref: 'Role'}] 
});

module.exports = mongoose.model('Role', roleSchema);