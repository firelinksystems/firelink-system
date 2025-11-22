# FireLink System

A comprehensive CRM and business management system for UK-based fire and security companies.

## Features

- **Customer Relationship Management** - Complete customer lifecycle management
- **Financial Management** - Full accounting with UK VAT compliance
- **Scheduling & Resource Allocation** - Intelligent engineer scheduling
- **Job Profitability Tracking** - Real-time P&L per job
- **Document Management** - Automated certificate generation (BS5839, etc.)
- **Online Payments** - Stripe and GoCardless integration
- **Mobile App** - Field engineer companion app

## Tech Stack

### Backend
- Node.js with Express.js
- PostgreSQL with Prisma ORM
- Redis for caching
- JWT authentication

### Frontend
- React.js with TypeScript
- Tailwind CSS
- Redux Toolkit
- Vite build tool

### Mobile
- React Native
- Expo

## Quick Start

```bash
# Clone repository
git clone https://github.com/your-org/firelink-system.git
cd firelink-system

# Setup with Docker
docker-compose up -d

# Or setup manually
cd backend && npm install
cd ../frontend && npm install
