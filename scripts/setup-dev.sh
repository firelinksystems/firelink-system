#!/bin/bash

# FireLink System Development Setup Script
echo "Setting up FireLink System development environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Create necessary directories
echo "Creating directories..."
mkdir -p logs
mkdir -p uploads
mkdir -p backups

# Setup backend
echo "Setting up backend..."
cd backend
npm install

# Copy environment files
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Backend .env file created. Please update with your configuration."
fi

# Setup frontend
echo "Setting up frontend..."
cd ../frontend
npm install

# Setup mobile
echo "Setting up mobile app..."
cd ../mobile
npm install

# Build Docker images
echo "Building Docker images..."
cd ..
docker-compose build

echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your database credentials"
echo "2. Run 'docker-compose up -d' to start services"
echo "3. Access the application at http://localhost:3000"
echo "4. Use credentials: admin@firelinksystem.com / password"
