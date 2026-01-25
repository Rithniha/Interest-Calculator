const Account = require('../models/Account');

// Create a new account/contact profile
exports.createAccount = async (req, res) => {
    try {
        const { name, phone, address, role } = req.body;

        const newAccount = new Account({
            userId: req.user.id, // Linked to the person currently logged in
            name,
            phone,
            address,
            role
        });

        const account = await newAccount.save();
        res.status(201).json(account);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all accounts linked to the logged-in user
exports.getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single account by ID
exports.getAccountById = async (req, res) => {
    try {
        const account = await Account.findOne({ _id: req.params.id, userId: req.user.id });
        if (!account) return res.status(404).json({ message: 'Account not found' });
        res.json(account);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
