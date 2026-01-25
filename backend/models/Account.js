const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The app user who owns this contact
    name: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    role: { type: String, enum: ['Investor', 'Borrower'], required: true },
    outstandingBalance: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Account', accountSchema);
