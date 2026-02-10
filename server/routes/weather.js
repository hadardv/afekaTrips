const express = require('express');
const router = express.Router();
const { getWeatherForecast } = require('../services/weatherService');
const auth = require('../middleware/authMiddleware');

router.get('/:city', auth, async (req, res) => {
    try {
        const { city } = req.params;
        if (!city) {
            return res.status(400).json({ message: 'City parameter is required' });
        }

        const forecast = await getWeatherForecast(city);
        res.json(forecast);
    } catch (err) {
        console.error("Weather Route Error:", err);
        res.status(500).json({ message: 'Failed to fetch weather', error: err.message });
    }
});

module.exports = router;
