export class Helpers {
  static formatPhoneNumber(phone: string): string {
    // Basic UK phone number formatting
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.startsWith('0')) {
      return `+44${cleaned.substring(1)}`;
    }
    
    if (cleaned.startsWith('44')) {
      return `+${cleaned}`;
    }
    
    return `+44${cleaned}`;
  }

  static formatPostcode(postcode: string): string {
    // Basic UK postcode formatting
    return postcode.replace(/\s+/g, '').toUpperCase();
  }

  static generateReference(prefix: string, length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = prefix + '-';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  static calculateDistance(postcode1: string, postcode2: string): number {
    // Mock distance calculation
    // In a real application, you'd use a postcode lookup service
    return Math.random() * 100; // Random distance between 0-100 miles
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  }

  static formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-GB').format(date);
  }

  static async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }
}
