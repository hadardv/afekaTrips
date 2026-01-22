const express = require('express');
const Trip = require('../models/Trip');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    try {
        const { title, location, tripType, durationDays, routeData, weatherForecast, imageUrl } = req.body;

        const newTrip = new Trip({
            userId: req.user.id,
            title,
            location,
            tripType,
            durationDays,
            routeData,
            weatherForecast,
            imageUrl
        });

        const trip = await newTrip.save();
        res.json(trip);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const { location, tripType, durationDays } = req.query;

        let query = { userId: req.user.id };

        if (location) query.location = new RegExp(location, 'i');
        if (tripType) query.tripType = tripType;
        if (durationDays) query.durationDays = durationDays;

        const trips = await Trip.find(query).sort({ createdAt: -1 });
        res.json(trips);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
