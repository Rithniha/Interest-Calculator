const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

// Get overview stats for the dashboard
exports.getOverview = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find all accounts for the user
        const accounts = await Account.find({ userId });

        // Calculate total amount lent (outstanding balance)
        const totalOutstanding = accounts.reduce((sum, acc) => sum + acc.outstandingBalance, 0);

        // Get top performance accounts
        const topAccounts = await Account.find({ userId })
            .sort({ outstandingBalance: -1 })
            .limit(5);

        // Get recent active transactions for the "Payments Due" slider
        // In a real app, you'd filter by due date. Here we take the latest 5.
        const duePayments = await Transaction.find({ userId, status: 'Active' })
            .populate('accountId', 'name')
            .sort({ date: -1 })
            .limit(5);

        res.json({
            totalOutstanding,
            topAccounts,
            duePayments
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
