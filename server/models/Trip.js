const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    location: {
        type: String, // City/Country
        required: true
    },
    tripType: {
        type: String,
        required: true,
        enum: ['Trek', 'Cycling', 'Urban', 'Nature']
    },
    durationDays: {
        type: Number,
        required: true
    },
    routeData: {
        type: Object,
        required: true
    },
    weatherForecast: {
        type: Object,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

tripSchema.index({ userId: 1, location: 1, tripType: 1, durationDays: 1 });

module.exports = mongoose.model('Trip', tripSchema);
