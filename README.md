# Rohman Admin Backend

Backend API for Rohman Admin App built with Node.js, Express, and MongoDB.

## Features
- JWT Authentication & Role-based Access Control
- Real-time updates with Socket.IO
- Audit Logging system
- Push Notifications via Firebase Admin SDK
- Dashboard statistics
- User, Device, License, and PIN management

## Tech Stack
- Node.js & Express
- MongoDB & Mongoose
- Socket.IO
- Firebase Admin SDK
- Winston Logger

## Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure `.env` (use `.env.example` as template)
4. Start development server: `npm run dev`

## Deployment (Railway)
1. Link your GitHub repository to Railway.
2. Add environment variables in Railway dashboard.
3. Railway will automatically detect `Dockerfile` or `package.json` and deploy.

## Monitoring
- Health check: `/health`
- Status: `/api/status`
- System Info: `/api/system-info`
