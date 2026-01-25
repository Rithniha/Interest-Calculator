const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
    getProfile,
    updateProfile,
    updateSettings,
    changePassword,
    deactivateAccount
} = require('../controllers/userController');

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/settings', auth, updateSettings);
router.put('/change-password', auth, changePassword);
router.delete('/deactivate', auth, deactivateAccount);

module.exports = router;
