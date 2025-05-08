const Role = require('./models/role');   // Adjust path
const RBAC_User = require('./models/user');  // Adjust path
const connectDB = require('./config/db');
const Permission = require('./models/permission');
const { createPermission, createRole, assignRoleToUser, removeRoleFromUser } = require('./controllers/roleController');
connectDB();

const testRoleController = async() => {
    
}