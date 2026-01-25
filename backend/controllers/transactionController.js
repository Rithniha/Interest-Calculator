const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

// Helper function to calculate interest (Mental Preview - we can expand this)
const calculateInterest = (principal, rate, type, startDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());

    if (type === 'Simple') {
        // Interest = (P * R * T) / 100
        return (principal * (rate / 100) * months);
    } else {
        // Compound: A = P(1 + r/n)^(nt) - for simplicity, monthly compounding
        return principal * (Math.pow((1 + rate / 100), months)) - principal;
    }
};

// Create a new transaction (Lend/Borrow)
exports.createTransaction = async (req, res) => {
    try {
        const { accountId, amount, type, interestRate, interestType, paymentFrequency, notes } = req.body;

        const newTransaction = new Transaction({
            userId: req.user.id,
            accountId,
            amount,
            type, // 'Given' or 'Taken'
            interestRate,
            interestType,
            paymentFrequency,
            notes,
            screenshot: req.file ? req.file.path : null
        });

        const transaction = await newTransaction.save();

        // AUTOMATIC ADJUSTMENT: Update account balance
        // If 'Given' (we lent money), the person owes us MORE (balance increases)
        // If 'Taken' (we borrowed money), we owe MORE (balance decreases/track separately)
        const adjustment = type === 'Given' ? amount : -amount;
        await Account.findByIdAndUpdate(accountId, { $inc: { outstandingBalance: adjustment } });

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get transaction history for an account
exports.getTransactions = async (req, res) => {
    try {
        const { accountId } = req.params;
        const transactions = await Transaction.find({ accountId, userId: req.user.id }).sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
