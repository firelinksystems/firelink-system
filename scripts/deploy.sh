#!/bin/bash

# FireLink System Deployment Script
set -e

echo "Starting FireLink System deployment..."

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
fi

# Build and start services
echo "Building and starting services..."
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo "Waiting for services to be healthy..."
sleep 30

# Run database migrations
echo "Running database migrations..."
docker-compose -f docker-compose.prod.yml exec backend npm run db:migrate

# Seed database if needed
echo "Seeding database..."
docker-compose -f docker-compose.prod.yml exec backend npm run db:seed

# Health checks
echo "Performing health checks..."
curl -f http://localhost:3001/health || exit 1
curl -f http://localhost:3000 || exit 1

echo "Deployment completed successfully!"
echo ""
echo "Access your application:"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:3001"
echo ""
echo "Default login: admin@firelinksystem.com / password"
