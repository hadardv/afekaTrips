const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function getWeatherForecast(city) {
    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
        console.error("WEATHER_API_KEY is missing");
        throw new Error("Server configuration error");
    }

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Weather API Error: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();

        const dailyForecasts = {};
        data.list.forEach(item => {
            const date = item.dt_txt.split(' ')[0];
            if (!dailyForecasts[date]) {
                dailyForecasts[date] = {
                    date: date,
                    temp: item.main.temp,
                    description: item.weather[0].description,
                    icon: item.weather[0].icon
                };
            }
        });

        return Object.values(dailyForecasts).slice(0, 5); // Return 5 days
    } catch (error) {
        console.error("Error fetching weather:", error);
        throw error;
    }
}

module.exports = { getWeatherForecast };
