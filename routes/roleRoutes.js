const express = require('express');
const router = express.Router();
const { createPermission, createRole, assignRoleToUser, removeRoleFromUser } = require('../controllers/roleController');

router.post('/permissions', createPermission);
router.post('/roles', createRole);
router.post('/users/:userId/roles', assignRoleToUser);
router.delete('/users/:userId/roles/:roleId', removeRoleFromUser);

module.exports = router;