const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    profilePic: { type: String, default: '' },

    // Interest Preferences
    settings: {
        defaultInterestType: { type: String, enum: ['Simple', 'Compound'], default: 'Simple' },
        defaultInterestRate: { type: Number, default: 2.5 },
        defaultFrequency: { type: String, enum: ['Monthly', 'Yearly', 'Daily'], default: 'Monthly' },
        gracePeriod: { type: Number, default: 0 },

        // Notification Settings
        notificationsEnabled: { type: Boolean, default: true },
        reminderAdvance: { type: Number, default: 3 }, // days before

        // App Preferences
        theme: { type: String, enum: ['light', 'dark'], default: 'light' },
        currency: { type: String, default: '₹' },
        dateFormat: { type: String, default: 'DD/MM/YYYY' },
        showGraphs: { type: Boolean, default: true }
    },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
