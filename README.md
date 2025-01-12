// File structure:
.
├── README.md
├── docker-compose.yml
├── package.json
├── run.sh
├── src
│   ├── config
│   │   └── config.js
│   ├── middleware
│   │   └── rateLimiter.js
│   ├── models
│   │   └── url.js
│   ├── routes
│   │   └── urlRoutes.js
│   └── server.js
└── .env.example

// README.md
# URL Shortener Service

A Node.js based URL shortener service with rate limiting and Docker support.

## Features
- URL shortening with custom length slugs
- Rate limiting by IP address
- Docker support for easy deployment
- MongoDB for persistent storage

## Prerequisites
- Node.js 18+
- Docker and Docker Compose
- MongoDB (provided via Docker)

## Installation

1. Clone the repository
2. Copy `.env.example` to `.env` and update values
3. Run `chmod +x run.sh` to make the run script executable
4. Run `./run.sh start` to start all services

## Commands
- `./run.sh start`: Start all services
- `./run.sh stop`: Stop all services
- `./run.sh restart`: Restart all services
- `./run.sh logs`: View logs

## API Endpoints
- POST /api/shorten
  - Body: { "url": "https://example.com" }
  - Returns shortened URL
- GET /:shortCode
  - Redirects to original URL

## Rate Limiting
- 100 requests per hour per IP address
- Status 429 returned when limit exceeded
