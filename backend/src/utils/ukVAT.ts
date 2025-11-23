export class UKVATCalculator {
  private static readonly STANDARD_RATE = 0.20; // 20%
  private static readonly REDUCED_RATE = 0.05;  // 5%
  private static readonly ZERO_RATE = 0.00;     // 0%

  static calculateVAT(amount: number, rate: 'standard' | 'reduced' | 'zero' = 'standard') {
    const rates = {
      standard: this.STANDARD_RATE,
      reduced: this.REDUCED_RATE,
      zero: this.ZERO_RATE
    };

    const vatRate = rates[rate];
    const vatAmount = amount * vatRate;
    const grossAmount = amount + vatAmount;

    return {
      net: amount,
      vat: vatAmount,
      gross: grossAmount,
      rate: vatRate
    };
  }

  static validateVATNumber(vatNumber: string): boolean {
    const ukVatRegex = /^GB[0-9]{9}$|^GB[0-9]{12}$|^GBGD[0-9]{3}$|^GBHA[0-9]{3}$/;
    return ukVatRegex.test(vatNumber.toUpperCase());
  }

  static formatVATNumber(vatNumber: string): string {
    const cleaned = vatNumber.replace(/\s+/g, '').toUpperCase();
    
    if (!this.validateVATNumber(cleaned)) {
      throw new Error('Invalid UK VAT number format');
    }

    return cleaned;
  }

  static generateVATInvoiceNumber(sequence: number): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const sequenceStr = sequence.toString().padStart(4, '0');
    
    return `VAT-${year}${month}-${sequenceStr}`;
  }
}
