const express = require('express');
const router = express.Router();
const { generateTripItinerary } = require('../services/aiService');
const auth = require('../middleware/authMiddleware');

router.post('/generate', auth, async (req, res) => {
    try {
        const { destination, tripType, durationDays, interests } = req.body;

        if (!destination || !tripType || !durationDays) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const tripData = {
            destination,
            tripType,
            durationDays,
            interests
        };

        const itinerary = await generateTripItinerary(tripData);
        res.json(itinerary);
    } catch (err) {
        console.error("AI Route Error:", err);
        res.status(500).json({ message: 'Failed to generate trip', error: err.message });
    }
});

module.exports = router;
