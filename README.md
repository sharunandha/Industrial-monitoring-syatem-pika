# Industrial Energy Monitoring Web Application

This workspace contains a full-stack IoT energy monitoring system with a Node.js backend and a React dashboard.

## Project Structure

- backend: Express API, JWT auth, ThingSpeak proxy, analytics, alerts
- frontend: React + Vite dashboard with Tailwind and Recharts

## Backend Setup

1) Copy backend/.env.example to backend/.env and fill values (ThingSpeak keys required).
2) Install dependencies:
   - cd backend
   - npm install
3) Start the server:
   - npm run dev

## Frontend Setup

1) Copy frontend/.env.example to frontend/.env and update VITE_API_URL.
2) Install dependencies:
   - cd frontend
   - npm install
3) Start the dashboard:
   - npm run dev

## Core API Endpoints

- POST /api/auth/login
- POST /api/auth/register (admin only)
- GET /api/auth/me

- GET /api/devices
- POST /api/devices
- PUT /api/devices/:deviceId
- POST /api/devices/:deviceId/rotate-key

- POST /api/data (device auth)
- GET /api/data
- GET /api/data/latest
- GET /api/data/stream

- GET /api/analytics/summary
- GET /api/analytics/compare
- GET /api/analytics/predict
- GET /api/analytics/export
- GET /api/analytics/report/pdf

- GET /api/alerts/active
- GET /api/alerts/history
- POST /api/alerts/:id/ack
- PUT /api/alerts/thresholds/:deviceId

- GET /api/device-control/:deviceId

## Data Ingestion Payload

POST /api/data

{
  "deviceId": "esp32-001",
  "voltage": 230.5,
  "current": 4.9,
  "power": 1139.4,
  "energy": 15.7,
  "temperature": 41.2,
  "timestamp": "2026-02-12T08:30:00Z"
}

Device authentication uses header x-device-key or body deviceKey (ThingSpeak Write API key).

## Deployment Notes

- Set environment variables in backend/.env and frontend/.env.
- Ensure ThingSpeak keys are valid and the channel is accessible.
- For production, set CORS_ORIGIN to the dashboard domain.
- Update THINGSPEAK_* keys to point to your channel.

## ESP32 HTTP POST Example

See esp32_example.ino for a minimal ESP32 data post example using HTTPClient.
