const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// Get overview stats for the dashboard
exports.getOverview = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new mongoose.Types.ObjectId(userId);

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

        // Monthly Cash Flow Data
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyStats = await Transaction.aggregate([
            { $match: { userId: userObjectId, date: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { month: { $month: "$date" }, year: { $year: "$date" } },
                    given: { $sum: { $cond: [{ $eq: ["$type", "Given"] }, "$amount", 0] } },
                    taken: { $sum: { $cond: [{ $eq: ["$type", "Taken"] }, "$amount", 0] } }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        res.json({
            totalOutstanding,
            topAccounts,
            duePayments,
            monthlyStats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get categorized reminders (Overdue, Today, Upcoming)
exports.getReminders = async (req, res) => {
    try {
        const userId = req.user.id;
        const now = new Date();

        // Find all active transactions
        const transactions = await Transaction.find({ userId, status: 'Active' }).populate('accountId', 'name');

        const reminders = {
            overdue: [],
            today: [],
            upcoming: []
        };

        transactions.forEach(t => {
            const startDate = new Date(t.date);
            let nextDue = new Date(startDate);

            // Simplified logic: calculate next due date based on frequency
            if (t.paymentFrequency === 'Monthly') nextDue.setMonth(nextDue.getMonth() + 1);
            else if (t.paymentFrequency === 'Daily') nextDue.setDate(nextDue.getDate() + 1);
            else if (t.paymentFrequency === 'Weekly') nextDue.setDate(nextDue.getDate() + 7);
            else if (t.paymentFrequency === 'Yearly') nextDue.setFullYear(nextDue.getFullYear() + 1);

            const diffTime = nextDue - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            const reminderObj = {
                transactionId: t._id,
                accountId: t.accountId?._id,
                personName: t.accountId?.name || 'Unknown',
                amount: t.amount,
                dueDate: nextDue,
                days: Math.abs(diffDays)
            };

            if (diffDays < 0) reminders.overdue.push(reminderObj);
            else if (diffDays === 0) reminders.today.push(reminderObj);
            else if (diffDays <= 7) reminders.upcoming.push(reminderObj);
        });

        res.json(reminders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
