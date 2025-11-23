const express = require('express');

const app = express();

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'FireLink Backend API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API info
app.get('/api', (req, res) => {
  res.json({ 
    message: '🔥 FireLink System API',
    version: '1.0.0',
    description: 'CRM for UK Fire & Security Companies',
    endpoints: [
      'GET  /health',
      'GET  /api',
      'GET  /api/customers',
      'GET  /api/jobs',
      'GET  /api/engineers'
    ]
  });
});

// Mock data
const customers = [
  {
    id: '1',
    companyName: 'ABC Security Ltd',
    contactName: 'John Smith',
    email: 'john@abcsecurity.com',
    phone: '+441234567890',
    address: '123 Business Park, London',
    postcode: 'SW1A 1AA'
  }
];

const jobs = [
  {
    id: '1',
    customerId: '1',
    title: 'Fire Alarm Installation - Office Building',
    description: 'Install new fire alarm system throughout office building',
    jobType: 'INSTALLATION',
    status: 'SCHEDULED',
    priority: 'HIGH',
    scheduledStart: '2024-02-01T09:00:00Z',
    scheduledEnd: '2024-02-01T17:00:00Z',
    estimatedHours: 8
  }
];

const engineers = [
  {
    id: '1',
    name: 'Mike Engineer',
    email: 'mike@firelinksystem.com',
    phone: '+441234567891',
    skills: ['fire_alarms', 'cctv', 'access_control'],
    hourlyRate: 45.00,
    isActive: true
  }
];

// Customers API
app.get('/api/customers', (req, res) => {
  res.json({
    success: true,
    data: customers,
    total: customers.length
  });
});

app.get('/api/customers/:id', (req, res) => {
  const customer = customers.find(c => c.id === req.params.id);
  if (!customer) {
    return res.status(404).json({
      success: false,
      error: 'Customer not found'
    });
  }
  
  res.json({
    success: true,
    data: customer
  });
});

// Jobs API
app.get('/api/jobs', (req, res) => {
  const jobsWithCustomers = jobs.map(job => ({
    ...job,
    customer: customers.find(c => c.id === job.customerId)
  }));
  
  res.json({
    success: true,
    data: jobsWithCustomers,
    total: jobs.length
  });
});

app.get('/api/jobs/:id', (req, res) => {
  const job = jobs.find(j => j.id === req.params.id);
  if (!job) {
    return res.status(404).json({
      success: false,
      error: 'Job not found'
    });
  }
  
  const jobWithCustomer = {
    ...job,
    customer: customers.find(c => c.id === job.customerId)
  };
  
  res.json({
    success: true,
    data: jobWithCustomer
  });
});

// Engineers API
app.get('/api/engineers', (req, res) => {
  res.json({
    success: true,
    data: engineers,
    total: engineers.length
  });
});

// Scheduling API
app.get('/api/scheduling/calendar', (req, res) => {
  const schedule = jobs.map(job => ({
    id: job.id,
    jobId: job.id,
    title: job.title,
    start: job.scheduledStart,
    end: job.scheduledEnd,
    engineer: 'Mike Engineer',
    customer: customers.find(c => c.id === job.customerId)?.companyName,
    status: job.status.toLowerCase()
  }));
  
  res.json({
    success: true,
    data: schedule
  });
});

// Financial API
app.get('/api/financial/invoices', (req, res) => {
  const invoices = [
    {
      id: '1',
      jobId: '1',
      invoiceNumber: 'INV-001',
      amount: 2500.00,
      vatAmount: 500.00,
      totalAmount: 3000.00,
      status: 'SENT',
      dueDate: '2024-02-15T00:00:00Z',
      sentDate: '2024-01-20T00:00:00Z'
    }
  ];
  
  res.json({
    success: true,
    data: invoices
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🔥 FireLink Server running on port ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`🚀 API: http://localhost:${PORT}/api`);
});
