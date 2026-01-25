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

// Create a new transaction (Lend/Borrow/Repay)
exports.createTransaction = async (req, res) => {
    try {
        const { accountId, amount, type, interestRate, interestType, paymentFrequency, notes, category, isRepayment } = req.body;

        const newTransaction = new Transaction({
            userId: req.user.id,
            accountId,
            amount: parseFloat(amount),
            type, // 'Given' or 'Taken'
            category: category || 'Principal',
            interestRate: parseFloat(interestRate || 0),
            interestType: interestType || 'Simple',
            paymentFrequency: paymentFrequency || 'Monthly',
            notes,
            isRepayment: isRepayment === 'true' || isRepayment === true,
            screenshot: req.file ? req.file.path : null
        });

        const transaction = await newTransaction.save();

        // LEDGER LOGIC: Update account balance
        // If it's a repayment, it ALWAYS reduces the absolute magnitude of the balance
        const account = await Account.findById(accountId);
        let adjustment = 0;

        if (newTransaction.isRepayment) {
            // Repayment reduces what is owed
            // If balance was positive (they owed us), repayment makes it less positive
            // If balance was negative (we owed them), repayment makes it less negative
            adjustment = account.outstandingBalance > 0 ? -parseFloat(amount) : parseFloat(amount);
        } else {
            // Principal addition
            // If 'Given' (we lent), balance increases
            // If 'Taken' (we borrowed), balance decreases (becomes more negative)
            adjustment = type === 'Given' ? parseFloat(amount) : -parseFloat(amount);
        }

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
