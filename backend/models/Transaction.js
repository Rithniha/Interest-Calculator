const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['Given', 'Taken'], required: true },
    interestRate: { type: Number, required: true },
    interestType: { type: String, enum: ['Simple', 'Compound'], default: 'Simple' },
    paymentFrequency: { type: String, enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'], default: 'Monthly' },
    date: { type: Date, default: Date.now },
    screenshot: { type: String }, // URL to AWS S3 or local path
    notes: { type: String },
    status: { type: String, enum: ['Active', 'Completed', 'Overdue'], default: 'Active' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
