# URL Shortener Service

A full-stack URL shortener service with OCR capabilities, built with Node.js, React, and MongoDB.

## Features
- URL shortening with custom length slugs
- Rate limiting by IP address
- OCR service integration for document processing
- Docker support for easy deployment
- MongoDB for persistent storage

## Tech Stack
- Backend: Node.js + Express
- Frontend: React + Vite
- Database: MongoDB
- Containerization: Docker
- Proxy: Nginx
- CI/CD: GitHub Actions

## Prerequisites
- Node.js 18+
- Docker and Docker Compose
- Git

## Local Development Setup

1. Clone the repository
```bash
git clone [your-repo-url]
cd url-shortener
```

2. Environment Setup
```bash
# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Update environment variables
# Backend .env
PORT=3000
MONGODB_URI=mongodb://mongo:27017/urlshortener
OCR_API_KEY=your_api_key
OCR_API_ENDPOINT=your_endpoint

# Frontend .env
VITE_API_URL=http://localhost:3000
```

3. Start the services
```bash
chmod +x run.sh
./run.sh start
```

4. Access the applications:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Project Structure
```
url-shortener/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── App.jsx
│   └── index.html
└── docker-compose.yml
```

## Available Scripts
- `./run.sh start`: Start all services
- `./run.sh stop`: Stop all services
- `./run.sh restart`: Restart all services
- `./run.sh logs`: View logs

## API Documentation

### URL Shortening
```http
POST /shorten
Content-Type: application/json

{
  "url": "https://example.com"
}
```

### Internal OCR Service
The OCR service is available internally through the OcrService class:
```javascript
const OcrService = require('./services/OcrService');
const ocr = new OcrService(apiKey, endpoint);
await ocr.processImage(imageBuffer);
```

## Deployment

### Nginx Configuration
Create `/etc/nginx/sites-available/url-shortener`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
ln -s /etc/nginx/sites-available/url-shortener /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install Dependencies
        run: |
          cd frontend
          npm install
          cd ../backend
          npm install

      - name: Build Frontend
        run: |
          cd frontend
          npm run build

      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /path/to/deployment
            git pull
            docker compose down -v
            docker compose build --no-cache
            docker compose up -d

      - name: Cleanup
        run: docker system prune -f
```

### Production Deployment Steps

1. Set up a server with Docker and Nginx installed

2. Configure GitHub Secrets:
   - `HOST`: Your server IP/domain
   - `USERNAME`: SSH username
   - `SSH_KEY`: SSH private key

3. Set up SSL with Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

4. First-time deployment:
```bash
# On your server
git clone [your-repo-url]
cd url-shortener
cp backend/.env.example backend/.env
# Edit .env files with production values
docker compose up -d
```

## Security Considerations
- All API endpoints are rate-limited
- CORS is configured for specific origins
- OCR service is internal-only
- Environment variables for sensitive data
- SSL/TLS in production

## Monitoring and Logging
- Docker logs available via `./run.sh logs`
- MongoDB logs in Docker volume
- Nginx access and error logs

## Troubleshooting
1. If containers fail to start:
   ```bash
   docker compose logs
   ```

2. For permission issues:
   ```bash
   sudo chown -R $USER:$USER .
   ```

3. To rebuild containers:
   ```bash
   docker compose build --no-cache
   ```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License
[Your chosen license]










## Scaling and High Availability

### Architecture Overview
The application is designed to scale horizontally with the following components:

1. **Load Balancing**
   - Nginx acts as a reverse proxy and load balancer
   - Distributes traffic across multiple backend instances
   - SSL termination at Nginx level

2. **Backend Scaling**
   ```bash
   # Scale backend service
   docker service scale url-shortener_backend=5
   ```
   - Stateless design allows horizontal scaling
   - Uses Redis for session storage and caching
   - Rate limiting implemented via Redis

3. **Database Scaling**
   - MongoDB replica set for high availability
   - Sharding for horizontal scaling
   ```bash
   # Initialize replica set
   mongo --eval "rs.initiate()"
   ```

4. **Caching Layer**
   - Redis cluster for distributed caching
   - Session storage
   - Rate limiting counters

### Production Configuration

1. **Environment Setup**
   Required GitHub Secrets:
   - `BACKEND_PORT`
   - `MONGODB_URI`
   - `OCR_API_KEY`
   - `OCR_API_ENDPOINT`
   - `VITE_API_URL`
   - `REDIS_URL`
   - `HOST`
   - `USERNAME`
   - `SSH_KEY`

2. **Docker Swarm Setup**
   ```bash
   # Initialize swarm
   docker swarm init

   # Deploy stack
   docker stack deploy -c docker-compose.prod.yml url-shortener
   ```

3. **Monitoring**
   - Prometheus for metrics collection
   - Grafana for visualization
   - ELK stack for log aggregation

4. **Backup Strategy**
   - MongoDB daily backups
   - Redis persistence
   - Regular volume backups

### Auto-Scaling Configuration

1. **Docker Auto-scaling**
   ```yaml
   deploy:
     mode: replicated
     replicas: 3
     update_config:
       parallelism: 1
       delay: 10s
     resources:
       limits:
         cpus: '0.50'
         memory: 512M
     restart_policy:
       condition: on-failure
   ```

2. **Load Testing**
   ```bash
   # Using k6 for load testing
   k6 run load-test.js
   ```

### Failover Handling
1. **Backend Failover**
   - Health checks trigger automatic container restart
   - Load balancer removes unhealthy instances

2. **Database Failover**
   - MongoDB replica set automatic failover
   - Redis sentinel for high availability

3. **Session Persistence**
   - Distributed session storage in Redis
   - No session affinity requirement

### Performance Optimization
1. **Caching Strategy**
   ```javascript
   // Example Redis caching implementation
   const cachedData = await redis.get(key);
   if (!cachedData) {
     const data = await fetchData();
     await redis.set(key, JSON.stringify(data), 'EX', 3600);
   }
   ```

2. **Rate Limiting**
   - Distributed rate limiting using Redis
   - Per-IP and per-user limits

### Security in Scaled Environment
1. **SSL/TLS Configuration**
   - SSL termination at load balancer
   - Internal service communication over encrypted network

2. **Network Isolation**
   - Internal services not exposed to public
   - Separate networks for frontend and backend

### Deployment Strategies
1. **Rolling Updates**
   ```bash
   docker service update --image new-image:tag --update-parallelism 1 --update-delay 10s service-name
   ```

2. **Blue-Green Deployment**
   - Maintain two identical environments
   - Switch traffic after successful deployment

### Monitoring and Alerts
1. **Metrics to Monitor**
   - Container health
   - Response times
   - Error rates
   - Resource usage

2. **Alert Configuration**
   ```yaml
   alerting:
     alerts:
       - name: high_error_rate
         if: error_rate > 1%
         for: 5m
   ```

To implement these scaling features:

1. Update your local development environment:
```bash
# Start with basic services
./run.sh start

# Scale services in development
docker compose up --scale backend=3
```

2. Set up monitoring:
```bash
# Deploy monitoring stack
docker stack deploy -c monitoring-stack.yml monitoring
```

3. Configure backups:
```bash
# Set up automated backups
./scripts/setup-backups.sh
```

Remember to:
- Monitor resource usage during scaling
- Implement proper logging across all instances
- Set up alerts for critical metrics
- Regular load testing to verify scaling efficiency