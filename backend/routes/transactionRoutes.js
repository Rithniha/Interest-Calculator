const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createTransaction, getTransactions } = require('../controllers/transactionController');
const multer = require('multer');

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/', auth, upload.single('screenshot'), createTransaction);
router.get('/:accountId', auth, getTransactions);

module.exports = router;
