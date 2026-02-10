const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function generateTripItinerary(tripData) {
    const { message, tripType, durationDays, destination } = tripData;

    let specificInstructions = '';
    if (tripType === 'Cycling') {
        specificInstructions = `
        Trip Type: Cycling.
        Requirements:
        - Route: Continuous route from city to city (or town to town).
        - Daily Distance: 30-70 km per day.
        - Structure: 2 or 3 days continuous.
        - Include "dailyDistance" field (e.g., "45 km") for each day.
        - Realistic paths on existing roads/trails.
        `;
    } else if (tripType === 'Trek') {
        specificInstructions = `
        Trip Type: Trek (Hiking).
        Requirements:
        - Route: Loop trails (start and end at the same point) or specific point-to-point hikes.
        - Daily Distance: 5-10 km per day.
        - Structure: 1-3 independent daily routes.
        - Include "dailyDistance" field (e.g., "8 km") for each day.
        - Realistic trails.
        `;
    }

    const prompt = `
    Create a detailed day-by-day trip itinerary for a ${durationDays}-day trip to ${destination}.
    ${specificInstructions}
    
    Please provide the response in valid JSON format with the following structure:
    {
        "tripTitle": "A catchy title for the trip",
        "description": "Short description of the trip vibe",
        "itinerary": [
            {
                "day": 1,
                "dailyDistance": "XX km",
                "activities": [
                    {
                        "time": "Morning",
                        "description": "Activity description",
                        "location": "Specific place name",
                        "coordinates": { "lat": 48.8566, "lng": 2.3522 }
                    },
                    ...
                ]
            },
            ...
        ]
    }
    Only return the JSON object, no other text.
    `;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful travel assistant. You generate structured travel itineraries in JSON format."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 2000,
            response_format: { type: "json_object" }
        });

        const tripJson = JSON.parse(completion.choices[0]?.message?.content || '{}');

        // Enhance with real weather and image
        try {
            // Get coordinates from the first activity of the first day
            const firstLocation = tripJson.itinerary?.[0]?.activities?.[0]?.coordinates;

            if (firstLocation) {
                // Fetch Weather (Open-Meteo)
                const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${firstLocation.lat}&longitude=${firstLocation.lng}&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=3`;
                const weatherRes = await fetch(weatherUrl);
                const weatherData = await weatherRes.json();

                tripJson.weatherForecast = {
                    daily: weatherData.daily || null,
                    units: weatherData.daily_units || null
                };
            }

            // Generate Image URL (Pollinations.ai)
            const query = encodeURIComponent(`${tripType} trip in ${destination} landscape`);
            tripJson.generatedImageUrl = `https://image.pollinations.ai/prompt/${query}?width=1024&height=600&nologo=true`;

        } catch (enhancementError) {
            console.error("Error fetching extras:", enhancementError);
            // Non-blocking error
        }

        return tripJson;
    } catch (error) {
        console.error("Error generating trip from Groq:", error);
        throw new Error("Failed to generate trip itinerary");
    }
}

module.exports = { generateTripItinerary };
