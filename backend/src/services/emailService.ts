import nodemailer from 'nodemailer';
import { config } from '../config/config';
import { Invoice } from '../models/Financial';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: config.email.host,
      port: config.email.port,
      secure: false,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  async sendInvoiceEmail(to: string, invoice: Invoice) {
    const mailOptions = {
      from: '"FireLink System" <noreply@firelinksystem.com>',
      to,
      subject: `Invoice ${invoice.invoiceNumber} from FireLink System`,
      html: this.generateInvoiceEmail(invoice),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Invoice email sent to ${to}`);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendJobCompletionEmail(to: string, job: any) {
    const mailOptions = {
      from: '"FireLink System" <noreply@firelinksystem.com>',
      to,
      subject: `Job Completed - ${job.title}`,
      html: this.generateJobCompletionEmail(job),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Job completion email sent to ${to}`);
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }

  private generateInvoiceEmail(invoice: Invoice): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .header { background: #ef4444; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .footer { background: #f3f4f6; padding: 10px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>FireLink System</h1>
          <h2>Invoice ${invoice.invoiceNumber}</h2>
        </div>
        <div class="content">
          <p>Dear Customer,</p>
          <p>Please find your invoice attached. The total amount due is <strong>£${invoice.totalAmount.toFixed(2)}</strong>.</p>
          <p>Due date: ${new Date(invoice.dueDate).toLocaleDateString('en-GB')}</p>
          <p>You can pay online through our secure payment portal.</p>
        </div>
        <div class="footer">
          <p>FireLink System - UK Fire & Security Specialists</p>
          <p>Phone: +44 1234 567890 | Email: info@firelinksystem.com</p>
        </div>
      </body>
      </html>
    `;
  }

  private generateJobCompletionEmail(job: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .header { background: #ef4444; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .footer { background: #f3f4f6; padding: 10px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>FireLink System</h1>
          <h2>Job Completed</h2>
        </div>
        <div class="content">
          <p>Dear Customer,</p>
          <p>We're pleased to inform you that your job "<strong>${job.title}</strong>" has been completed.</p>
          <p>Our engineer has finished the work and all necessary certificates have been generated.</p>
          <p>You will receive your invoice shortly.</p>
        </div>
        <div class="footer">
          <p>FireLink System - UK Fire & Security Specialists</p>
          <p>Phone: +44 1234 567890 | Email: info@firelinksystem.com</p>
        </div>
      </body>
      </html>
    `;
  }
}
