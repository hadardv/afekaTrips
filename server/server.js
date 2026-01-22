require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');

const app = express();
const PORT = process.env.PORT || 5001;

app.use((req, res, next) => {
    console.log(`[DEBUG] ${req.method} ${req.url}`);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        console.log('[DEBUG] Responding to OPTIONS with 200');
        return res.status(200).end();
    }
    next();
});
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);


mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
