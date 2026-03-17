# AfekaTrips 🌍✈️

AfekaTrips is a comprehensive full-stack web application designed to help users plan, organize, and manage their trips effortlessly. The platform integrates AI-generated itineraries, real-time weather forecasts, and interactive maps to provide a seamless travel planning experience.

## 🚀 Live Demo (Cloud URL)

The application is deployed and accessible via the cloud:
**[👉 Click here to visit AfekaTrips Live](https://YOUR_NETLIFY_OR_CLOUD_URL_HERE) ** 
*(Replace with your actual live Netlify/Vercel/Render URL)*

## ✨ Features

*   **User Authentication & Authorization**: Secure sign-up/login system using JWT (JSON Web Tokens) and password encryption (Bcrypt).
*   **AI Trip Generator**: Personalized trip itineraries powered by Groq SDK AI based on user preferences, duration, and trip type.
*   **Interactive Maps & Routing**: Dynamic mapping and trip routing using react-leaflet and OpenRouteService (OSRM) API.
*   **Weather Forecast Integration**: Real-time integration with OpenWeatherMap API for weather details at destination.
*   **Responsive Design**: A sleek, modern user interface, fully responsive for both desktop and mobile devices.

## 🏗️ Architecture

AfekaTrips is built with a modern, decoupled architecture:

*   **Frontend (Client):** Next.js 16 (React 19, App Router), styled with Tailwind CSS and Framer Motion for smooth animations. Deployed as a Static Site export.
*   **Backend (Server):** Node.js with Express.js acting as a RESTful API.
*   **Database:** MongoDB, integrated via Mongoose to store user credentials, preferences, and saved trips securely.

---

## 🛠️ Installation & Local Setup

Follow these instructions to run the project locally on your machine.

### Prerequisites

*   **Node.js** (v18 or higher recommended)
*   **MongoDB** (Local instance installed or a MongoDB Atlas URI)
*   **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/hadardv/afekaTrips.git
cd afekaTrips
```

### 2. Setup the Server (Backend)

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables:
   Create a `.env` file in the `server` directory and configure the following variables (you can use `.env.example` as a reference):
   ```env
   # Server Port
   PORT=5001
   
   # MongoDB Connection String
   MONGODB_URI=mongodb://localhost:27017/afeka-trips
   
   # Security & Authentication
   JWT_SECRET=your_super_secret_jwt_key
   FRONTEND_URL=http://localhost:3000
   
   # Third-Party APIs
   GROQ_API_KEY=your_groq_api_key_here
   WEATHER_API_KEY=your_weather_api_key_here
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *(The server should now be running on `http://localhost:5001`)*

### 3. Setup the Client (Frontend)

1. Open a new terminal tab/window and navigate to the client folder from the project root:
   ```bash
   cd client
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables:
   Create a `.env.local` file in the `client` directory and set the API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *(The client should now be running on `http://localhost:3000`)*

---

## 💡 Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Register a new account or log in if you already have one.
3. Access the planner area to input your desired destination, trip duration, and preferences.
4. Let the AI generate an itinerary for you, view the route on the map, and check the weather forecast.
5. Save your trips and view them later in your History area!

## 📜 License
This project is for educational purposes. All rights reserved to the creators.
