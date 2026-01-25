const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createAccount, getAccounts, getAccountById, getAccountLedger } = require('../controllers/accountController');

// All routes are protected by the auth middleware
router.post('/', auth, createAccount);
router.get('/', auth, getAccounts);
router.get('/:id', auth, getAccountById);
router.get('/:id/ledger', auth, getAccountLedger);

module.exports = router;
