const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get current user profile & settings
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update personal information
exports.updateProfile = async (req, res) => {
    try {
        const { fullName, email, phone } = req.body;
        const user = await User.findById(req.user.id);

        if (fullName) user.fullName = fullName;
        if (email) user.email = email;
        if (phone !== undefined) user.phone = phone;

        await user.save();
        res.json({ message: 'Profile updated successfully', user: { fullName: user.fullName, email: user.email, phone: user.phone } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user settings (Interest, Notifications, Prefs)
exports.updateSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.settings = { ...user.settings, ...req.body };
        await user.save();
        res.json({ message: 'Settings updated successfully', settings: user.settings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Current password incorrect' });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Deactivate account
exports.deactivateAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
