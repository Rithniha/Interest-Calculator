const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware - CORS Configuration
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, or curl)
        if (!origin) return callback(null, true);

        // Allow all localhost origins for development
        if (origin.includes('localhost')) {
            return callback(null, true);
        }

        // Allow all Vercel deployments
        if (origin.includes('vercel.app')) {
            return callback(null, true);
        }

        // Allow specific production domain if set
        if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
            return callback(null, true);
        }

        console.log('⚠️  Origin not allowed by CORS:', origin);
        callback(null, true); // Allow anyway for now to debug
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization']
}));

app.use(express.json());
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.use('/uploads', express.static('uploads')); // Serve uploaded screenshots

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/accounts', require('./routes/accountRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Basic Route
app.get('/', (req, res) => {
    res.send('Interest Calculator API is running...');
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
