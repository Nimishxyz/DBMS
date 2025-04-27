const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/:userId/stats', userController.getUserStats);
router.get('/:userId/profile', userController.getUserProfile);
router.put('/:userId/profile', userController.updateUserProfile);


module.exports = router;