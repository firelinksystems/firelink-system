import { PrismaClient } from '@prisma/client';
import { 
  Customer, 
  CreateCustomerData, 
  UpdateCustomerData, 
  CustomerFilters 
} from '../models/Customer';

export class CustomerService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllCustomers(filters: CustomerFilters) {
    const { page, limit, search } = filters;
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { companyName: { contains: search, mode: 'insensitive' } },
        { contactName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    } : {};

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          jobs: {
            select: {
              id: true,
              status: true
            }
          }
        }
      }),
      this.prisma.customer.count({ where })
    ]);

    return {
      customers: customers.map(customer => ({
        ...customer,
        jobCount: customer.jobs.length
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { id },
      include: {
        jobs: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            jobAssignments: {
              include: {
                engineer: true
              }
            }
          }
        }
      }
    });
  }

  async createCustomer(data: CreateCustomerData): Promise<Customer> {
    // Validate UK VAT number if provided
    if (data.vatNumber && !this.isValidUKVAT(data.vatNumber)) {
      throw new Error('Invalid UK VAT number format');
    }

    return this.prisma.customer.create({
      data: {
        ...data,
        country: data.country || 'UK'
      }
    });
  }

  async updateCustomer(id: string, data: UpdateCustomerData): Promise<Customer> {
    if (data.vatNumber && !this.isValidUKVAT(data.vatNumber)) {
      throw new Error('Invalid UK VAT number format');
    }

    return this.prisma.customer.update({
      where: { id },
      data
    });
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.prisma.customer.delete({
      where: { id }
    });
  }

  private isValidUKVAT(vatNumber: string): boolean {
    const ukVatRegex = /^GB[0-9]{9}$|^GB[0-9]{12}$|^GBGD[0-9]{3}$|^GBHA[0-9]{3}$/;
    return ukVatRegex.test(vatNumber.toUpperCase());
  }
}
