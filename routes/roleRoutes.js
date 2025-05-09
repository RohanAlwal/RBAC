const express = require('express');
const router = express.Router();
const { createPermission, createRole, assignRoleToUser, removeRoleFromUser } = require('../controllers/roleController');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');



router.post('/permissions',authMiddleware, checkPermission('createPermission'), createPermission);
router.post('/roles', authMiddleware, checkPermission('createRole'), createRole);
router.post('/users/:userId/roles', authMiddleware, checkPermission('assignRole'), assignRoleToUser);
router.delete('/users/:userId/roles/:roleId', authMiddleware, checkPermission('removeRole'), removeRoleFromUser);

module.exports = router;