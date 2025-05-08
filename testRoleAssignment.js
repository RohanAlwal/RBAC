const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Mongoose Models
const Role = require('./models/role');   // Adjust path
const RBAC_User = require('./models/user');  // Adjust path
const connectDB = require('./config/db');
const Permission = require('./models/permission');
connectDB();

const testAssignRole = async () => {
  try {
    // Step 1: Create a role
    const permission1 = new Permission({ name: 'create' });
const permission2 = new Permission({ name: 'edit' });
const permission3 = new Permission({ name: 'delete' });

// Save permissions
await permission1.save();
await permission2.save();
await permission3.save();

// Now assign the ObjectIds to the Role
const role = new Role({
  name: 'Admin',
  permissions: [permission1._id, permission2._id, permission3._id]  // Use ObjectIds
});

    await role.save();
    const hasPermission = await Permission.findById(permission1._id);
    if(hasPermission) {
        console.log(hasPermission);
        process.exit(1);
    }

    console.log('Role created:', role);

    // Step 2: Create a user
    const user = new RBAC_User({
      email: 'testuser@example.com',
      password: 'password123',
      roles: [],
    });
    await user.save();

    console.log('User created:', user);

    // Step 3: Assign the role to the user
    user.roles.push(role._id);  // Add the role to user
    await user.save();  // Save the updated user with the role

    console.log('Role assigned to user:', user);

    // Step 4: Verify the result
    const updatedUser = await RBAC_User.findById(user._id).populate('roles');
    console.log('Updated user:', updatedUser);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
};

testAssignRole();
