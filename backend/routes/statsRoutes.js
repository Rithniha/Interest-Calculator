const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getOverview, getReminders } = require('../controllers/statsController');

router.get('/overview', auth, getOverview);
router.get('/reminders', auth, getReminders);

module.exports = router;
