const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createTransaction, getTransactions } = require('../controllers/transactionController');

router.post('/', auth, createTransaction);
router.get('/:accountId', auth, getTransactions);

module.exports = router;
