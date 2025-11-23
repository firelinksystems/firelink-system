import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'FireLink Backend API',
    version: '1.0.0'
  });
});

// API routes
app.get('/api', (req, res) => {
  res.json({ 
    message: 'FireLink System API',
    version: '1.0.0',
    endpoints: [
      '/health',
      '/api/customers',
      '/api/jobs',
      '/api/scheduling',
      '/api/financial'
    ]
  });
});

// Mock data endpoints (for initial deployment)
app.get('/api/customers', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        companyName: 'Demo Customer Ltd',
        contactName: 'John Smith',
        email: 'demo@customer.com',
        phone: '+441234567890'
      }
    ]
  });
});

app.get('/api/jobs', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        title: 'Demo Job',
        status: 'SCHEDULED',
        customerId: '1'
      }
    ]
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🔥 FireLink Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🚀 API: http://localhost:${PORT}/api`);
});
