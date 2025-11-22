import express from 'express';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Get all jobs
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, customerId, page = 1, limit = 10 } = req.query;

    // Mock data - replace with database queries
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
        estimatedHours: 8,
        customer: {
          companyName: 'ABC Security Ltd',
          contactName: 'John Smith'
        }
      }
    ];

    res.json({
      success: true,
      data: jobs,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: jobs.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Get job by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const job = {
      id: req.params.id,
      customerId: '1',
      title: 'Fire Alarm Installation - Office Building',
      description: 'Install new fire alarm system throughout office building',
      jobType: 'INSTALLATION',
      status: 'SCHEDULED',
      priority: 'HIGH',
      scheduledStart: '2024-02-01T09:00:00Z',
      scheduledEnd: '2024-02-01T17:00:00Z',
      estimatedHours: 8,
      actualHours: null,
      customer: {
        companyName: 'ABC Security Ltd',
        contactName: 'John Smith',
        email: 'john@abcsecurity.com',
        phone: '+441234567890'
      }
    };

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// Create job
router.post('/', authenticate, async (req, res) => {
  try {
    const jobData = req.body;

    const newJob = {
      id: Date.now().toString(),
      ...jobData,
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      data: newJob
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// Update job status
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;

    // Update job status in database
    const updatedJob = {
      id: req.params.id,
      status,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: updatedJob
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job status' });
  }
});

// Get job profitability
router.get('/:id/profitability', authenticate, async (req, res) => {
  try {
    const jobId = req.params.id;

    // Mock profitability data
    const profitability = {
      jobId,
      revenue: 2500.00,
      costs: {
        labour: 800.00,
        materials: 450.00,
        travel: 75.00,
        subcontractor: 0.00,
        other: 25.00
      },
      totalCosts: 1350.00,
      profit: 1150.00,
      margin: 46.0
    };

    res.json({
      success: true,
      data: profitability
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate profitability' });
  }
});

export { router as jobRoutes };
