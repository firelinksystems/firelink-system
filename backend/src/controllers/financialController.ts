import { Request, Response } from 'express';
import { FinancialService } from '../services/financialService';

export class FinancialController {
  private financialService: FinancialService;

  constructor() {
    this.financialService = new FinancialService();
  }

  createInvoice = async (req: Request, res: Response) => {
    try {
      const invoice = await this.financialService.createInvoice(req.body);
      
      res.status(201).json({
        success: true,
        data: invoice
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create invoice' });
    }
  };

  sendInvoice = async (req: Request, res: Response) => {
    try {
      const result = await this.financialService.sendInvoice(req.params.id);
      
      res.json({
        success: true,
        data: result.invoice,
        message: result.message
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send invoice' });
    }
  };

  processPayment = async (req: Request, res: Response) => {
    try {
      const payment = await this.financialService.processPayment(req.body);
      
      res.status(201).json({
        success: true,
        data: payment
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to process payment' });
    }
  };

  getProfitLossReport = async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.query;
      const report = await this.financialService.getProfitLossReport({
        startDate: startDate as string,
        endDate: endDate as string
      });
      
      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate report' });
    }
  };

  getVATReport = async (req: Request, res: Response) => {
    try {
      const { period } = req.query;
      const report = await this.financialService.getVATReport(period as string);
      
      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate VAT report' });
    }
  };
}
