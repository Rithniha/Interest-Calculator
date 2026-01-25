const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getOverview } = require('../controllers/statsController');

router.get('/overview', auth, getOverview);

module.exports = router;
