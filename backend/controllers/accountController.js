const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

// Helper function to calculate interest
const calculateInterest = (principal, rate, type, startDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    if (months <= 0) return 0;

    if (type === 'Simple') {
        return (principal * (rate / 100) * months);
    } else {
        return principal * (Math.pow((1 + rate / 100), months)) - principal;
    }
};

// Create a new account/contact profile
exports.createAccount = async (req, res) => {
    try {
        const { name, phone, address, role } = req.body;

        const newAccount = new Account({
            userId: req.user.id,
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

// Get a full ledger for an account (Person Profile)
exports.getAccountLedger = async (req, res) => {
    try {
        const { id } = req.params;
        const account = await Account.findOne({ _id: id, userId: req.user.id });
        if (!account) return res.status(404).json({ message: 'Account not found' });

        const transactions = await Transaction.find({ accountId: id, userId: req.user.id }).sort({ date: 1 });

        let totalGiven = 0;
        let totalTaken = 0;
        let accruedInterest = 0;

        transactions.forEach(t => {
            if (!t.isRepayment) {
                if (t.type === 'Given') totalGiven += t.amount;
                else totalTaken += t.amount;

                if (t.status === 'Active') {
                    accruedInterest += calculateInterest(t.amount, t.interestRate, t.interestType, t.date);
                }
            }
        });

        res.json({
            account,
            transactions,
            stats: {
                totalGiven,
                totalTaken,
                accruedInterest: parseFloat(accruedInterest.toFixed(2)),
                netPrincipal: account.outstandingBalance,
                totalPayable: parseFloat((account.outstandingBalance + accruedInterest).toFixed(2))
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
