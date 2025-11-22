import express from 'express';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Create invoice
router.post('/invoices', authenticate, async (req, res) => {
  try {
    const { jobId, amount, dueDate } = req.body;

    // Calculate VAT (UK standard rate 20%)
    const vatRate = 0.20;
    const vatAmount = amount * vatRate;
    const totalAmount = amount + vatAmount;

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}`;

    const invoice = {
      id: Date.now().toString(),
      jobId,
      invoiceNumber,
      amount,
      vatAmount,
      totalAmount,
      dueDate,
      status: 'DRAFT',
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// Send invoice to customer
router.post('/invoices/:id/send', authenticate, async (req, res) => {
  try {
    const invoiceId = req.params.id;

    // Update invoice status and send email
    const updatedInvoice = {
      id: invoiceId,
      status: 'SENT',
      sentDate: new Date().toISOString()
    };

    // TODO: Send email to customer with invoice

    res.json({
      success: true,
      data: updatedInvoice,
      message: 'Invoice sent successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send invoice' });
  }
});

// Process payment
router.post('/payments', authenticate, async (req, res) => {
  try {
    const { invoiceId, amount, paymentMethod, paymentType } = req.body;

    const payment = {
      id: Date.now().toString(),
      invoiceId,
      amount,
      paymentMethod,
      paymentType,
      processedAt: new Date().toISOString(),
      status: 'completed'
    };

    // TODO: Integrate with Stripe/GoCardless

    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

// Get financial reports
router.get('/reports/profit-loss', authenticate, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Mock P&L report
    const report = {
      period: {
        startDate,
        endDate
      },
      revenue: 50000.00,
      costs: {
        labour: 15000.00,
        materials: 8000.00,
        travel: 1200.00,
        subcontractor: 3000.00,
        overhead: 5000.00
      },
      totalCosts: 32200.00,
      grossProfit: 17800.00,
      netProfit: 15200.00,
      margin: 30.4
    };

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

export { router as financialRoutes };
