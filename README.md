# Movie Theater Seat Reservation System

A full-stack web application for managing movie theater seat reservations with real-time availability, seat locking, and concurrent booking support.

## Tech Stack

### Backend
- Node.js + Express + TypeScript
- MongoDB (Database)
- Redis (Caching & Seat Locking)
- JWT Authentication
- TMDB API Integration

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Zustand (State Management)
- React Router

## Features

- User authentication (JWT-based)
- Browse movies from TMDB API
- Real-time seat selection with visual seat map
- Temporary seat locking (5 minutes)
- Add-ons upselling (food, beverages, accessories)
- Reservation management
- Reward points system
- Concurrent reservation handling with Redis locks
- MongoDB transactions for data consistency

## Setup

### Prerequisites
- Node.js 20+
- MongoDB Atlas account
- TMDB API key
- Redis (optional - Upstash recommended)

### Environment Variables

Create `.env` file in root directory:

```env
MONGODB_URI=your-mongodb-uri
REDIS_URL=your-redis-url
JWT_SECRET=your-secret-key
TMDB_API_KEY=your-tmdb-key
FRONTEND_URL=http://localhost:5173
PORT=3000
```

Create `.env` file in frontend directory:

```env
VITE_API_URL=http://localhost:3000/api
```

### Installation

**Backend:**
```bash
cd backend
npm install
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Seed Database

```bash
cd backend
npm run seed
npm run seed:addons
```

## Docker

```bash
docker-compose up -d
```

## License

MIT
