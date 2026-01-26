const mongoose = require('mongoose');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

// Get overview stats for the dashboard
exports.getOverview = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Total Outstanding Balance
        const accounts = await Account.find({ userId });
        const totalOutstanding = accounts.reduce((sum, acc) => sum + acc.outstandingBalance, 0);

        // 2. Top Performing Accounts (by absolute balance)
        const topAccounts = await Account.find({ userId })
            .sort({ outstandingBalance: -1 })
            .limit(5);

        // 3. Current Due Payments (Recent active transactions that might need attention)
        // For now, let's take the latest 5 active transactions
        const duePayments = await Transaction.find({ userId, status: 'Active' })
            .populate('accountId', 'name')
            .sort({ date: -1 })
            .limit(5);

        // 4. Monthly Stats (given vs taken)
        const monthlyStats = await Transaction.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: { month: { $month: "$date" }, year: { $year: "$date" } },
                    given: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "Given"] }, "$amount", 0]
                        }
                    },
                    taken: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "Taken"] }, "$amount", 0]
                        }
                    }
                }
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } },
            { $limit: 6 }
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

// Get reminders (overdue, today, upcoming)
exports.getReminders = async (req, res) => {
    try {
        const userId = req.user.id;
        const now = new Date();
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));
        const endOfToday = new Date(now.setHours(23, 59, 59, 999));
        const sevenDaysLater = new Date(now.setDate(now.getDate() + 7));

        // In a real app, "due date" might be calculated. 
        // For this MVP, we'll assume the transaction date + some period or use a status.
        // Let's look for active transactions and categorize them.

        const activeTransactions = await Transaction.find({ userId, status: 'Active' })
            .populate('accountId', 'name');

        const reminders = {
            overdue: [],
            today: [],
            upcoming: []
        };

        activeTransactions.forEach(t => {
            const dueDate = new Date(t.date);
            // Example: assume 30 days cycle if not specified, but let's just use the transaction date for now
            // since we don't have a specific 'dueDate' field in the schema yet.
            // If the schema had a dueDate, we'd use that.

            // For the sake of this implementation, let's use the created date or assume a due date 
            // is set in the future for some transactions.

            const diffTime = dueDate - startOfToday;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            const reminderItem = {
                personName: t.accountId ? t.accountId.name : 'Unknown',
                amount: t.amount,
                dueDate: t.date,
                days: Math.abs(diffDays),
                accountId: t.accountId ? t.accountId._id : null
            };

            if (diffDays < 0) {
                reminders.overdue.push(reminderItem);
            } else if (diffDays === 0) {
                reminders.today.push(reminderItem);
            } else if (diffDays <= 7) {
                reminders.upcoming.push(reminderItem);
            }
        });

        res.json(reminders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
