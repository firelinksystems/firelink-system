#!/bin/bash

# Simple build script for FireLink System
set -e

echo "Building FireLink System..."

# Build backend
echo "Building backend..."
cd backend
npm install
npx prisma generate
npm run build
cd ..

# Build frontend  
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Build completed successfully!"
