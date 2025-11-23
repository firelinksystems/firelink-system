import { PrismaClient } from '@prisma/client';
import { Invoice, Payment, ProfitLossReport, VATReport } from '../models/Financial';
import { EmailService } from './emailService';

export class FinancialService {
  private prisma: PrismaClient;
  private emailService: EmailService;

  constructor() {
    this.prisma = new PrismaClient();
    this.emailService = new EmailService();
  }

  async createInvoice(data: {
    jobId: string;
    amount: number;
    dueDate: Date;
  }): Promise<Invoice> {
    const job = await this.prisma.job.findUnique({
      where: { id: data.jobId },
      include: { customer: true }
    });

    if (!job) {
      throw new Error('Job not found');
    }

    // Calculate VAT (UK standard rate 20%)
    const vatRate = 0.20;
    const vatAmount = data.amount * vatRate;
    const totalAmount = data.amount + vatAmount;

    // Generate invoice number
    const invoiceCount = await this.prisma.invoice.count();
    const invoiceNumber = `INV-${(invoiceCount + 1).toString().padStart(4, '0')}`;

    return this.prisma.invoice.create({
      data: {
        ...data,
        invoiceNumber,
        vatAmount,
        totalAmount,
        status: 'DRAFT'
      }
    });
  }

  async sendInvoice(invoiceId: string): Promise<{ invoice: Invoice; message: string }> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        job: {
          include: {
            customer: true
          }
        }
      }
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    // Update invoice status
    const updatedInvoice = await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'SENT',
        sentDate: new Date()
      }
    });

    // Send email to customer
    await this.emailService.sendInvoiceEmail(invoice.job.customer.email, invoice);

    return {
      invoice: updatedInvoice,
      message: 'Invoice sent successfully'
    };
  }

  async processPayment(data: {
    invoiceId: string;
    amount: number;
    paymentMethod: string;
    paymentType: string;
  }): Promise<Payment> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: data.invoiceId }
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    // Process payment (integration with Stripe/GoCardless would go here)
    const payment = await this.prisma.payment.create({
      data: {
        ...data,
        reference: `PAY-${Date.now()}`,
        status: 'completed',
        processedAt: new Date()
      }
    });

    // Update invoice status if fully paid
    if (data.amount >= invoice.totalAmount) {
      await this.prisma.invoice.update({
        where: { id: data.invoiceId },
        data: {
          status: 'PAID',
          paidDate: new Date()
        }
      });
    }

    return payment;
  }

  async getProfitLossReport(filters: { startDate?: string; endDate?: string }): Promise<ProfitLossReport> {
    const { startDate, endDate } = filters;
    
    const where: any = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [invoices, costs] = await Promise.all([
      this.prisma.invoice.findMany({
        where: { ...where, status: 'PAID' }
      }),
      this.prisma.jobCost.findMany({
        where,
        include: {
          job: true
        }
      })
    ]);

    const revenue = invoices.reduce((total, invoice) => total + invoice.amount, 0);
    
    const labourCost = costs
      .filter(cost => cost.costType === 'LABOUR')
      .reduce((total, cost) => total + cost.amount, 0);
    
    const materialCost = costs
      .filter(cost => cost.costType === 'MATERIALS')
      .reduce((total, cost) => total + cost.amount, 0);
    
    const travelCost = costs
      .filter(cost => cost.costType === 'TRAVEL')
      .reduce((total, cost) => total + cost.amount, 0);
    
    const subcontractorCost = costs
      .filter(cost => cost.costType === 'SUBCONTRACTOR')
      .reduce((total, cost) => total + cost.amount, 0);

    // Fixed overhead (this would come from a separate overhead calculation)
    const overhead = 5000;

    const totalCosts = labourCost + materialCost + travelCost + subcontractorCost + overhead;
    const grossProfit = revenue - totalCosts;
    const netProfit = grossProfit; // Simplified - would subtract taxes, etc.
    const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

    return {
      period: {
        startDate: startDate || new Date().toISOString().split('T')[0],
        endDate: endDate || new Date().toISOString().split('T')[0]
      },
      revenue,
      costs: {
        labour: labourCost,
        materials: materialCost,
        travel: travelCost,
        subcontractor: subcontractorCost,
        overhead
      },
      totalCosts,
      grossProfit,
      netProfit,
      margin: Number(margin.toFixed(1))
    };
  }

  async getVATReport(period: string): Promise<VATReport> {
    // Calculate VAT report for the given period
    const invoices = await this.prisma.invoice.findMany({
      where: {
        createdAt: {
          gte: new Date(period + '-01'),
          lte: new Date(period + '-31')
        },
        status: 'PAID'
      }
    });

    const totalSales = invoices.reduce((total, invoice) => total + invoice.amount, 0);
    const totalVAT = invoices.reduce((total, invoice) => total + invoice.vatAmount, 0);

    // Simplified - in reality, you'd calculate reclaimable VAT from purchases
    const totalPurchases = totalSales * 0.4; // Mock data
    const reclaimableVAT = totalPurchases * 0.2; // 20% VAT on purchases
    const vatDue = totalVAT - reclaimableVAT;

    return {
      period,
      totalSales,
      totalVAT,
      totalPurchases,
      reclaimableVAT,
      vatDue
    };
  }
}
