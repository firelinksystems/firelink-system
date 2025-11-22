import express from 'express';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Get all customers
router.get('/', authenticate, async (req, res) => {
  try {
    // Mock data - replace with database queries
    const customers = [
      {
        id: '1',
        companyName: 'ABC Security Ltd',
        contactName: 'John Smith',
        email: 'john@abcsecurity.com',
        phone: '+441234567890',
        address: '123 Business Park',
        city: 'London',
        postcode: 'SW1A 1AA',
        vatNumber: 'GB123456789'
      }
    ];

    res.json({
      success: true,
      data: customers,
      total: customers.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get customer by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const customer = {
      id: req.params.id,
      companyName: 'ABC Security Ltd',
      contactName: 'John Smith',
      email: 'john@abcsecurity.com',
      phone: '+441234567890',
      address: '123 Business Park',
      city: 'London',
      postcode: 'SW1A 1AA',
      vatNumber: 'GB123456789'
    };

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// Create customer
router.post('/', authenticate, async (req, res) => {
  try {
    const customerData = req.body;
    
    // Validate UK VAT number format
    if (customerData.vatNumber && !isValidUKVAT(customerData.vatNumber)) {
      return res.status(400).json({ error: 'Invalid UK VAT number format' });
    }

    // Create customer in database
    const newCustomer = {
      id: Date.now().toString(),
      ...customerData,
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      data: newCustomer
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// Helper function to validate UK VAT number
function isValidUKVAT(vatNumber: string): boolean {
  const ukVatRegex = /^GB[0-9]{9}$|^GB[0-9]{12}$|^GBGD[0-9]{3}$|^GBHA[0-9]{3}$/;
  return ukVatRegex.test(vatNumber.toUpperCase());
}

export { router as customerRoutes };
