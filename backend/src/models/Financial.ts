export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export type PaymentMethod = 'CARD' | 'BANK_TRANSFER' | 'DIRECT_DEBIT' | 'CASH';

export interface Invoice {
  id: string;
  jobId: string;
  invoiceNumber: string;
  amount: number;
  vatAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  dueDate: Date;
  sentDate?: Date;
  paidDate?: Date;
  createdAt: Date;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentType: string;
  processedAt: Date;
  status: string;
  reference: string;
}

export interface ProfitLossReport {
  period: {
    startDate: string;
    endDate: string;
  };
  revenue: number;
  costs: {
    labour: number;
    materials: number;
    travel: number;
    subcontractor: number;
    overhead: number;
  };
  totalCosts: number;
  grossProfit: number;
  netProfit: number;
  margin: number;
}

export interface VATReport {
  period: string;
  totalSales: number;
  totalVAT: number;
  totalPurchases: number;
  reclaimableVAT: number;
  vatDue: number;
}
