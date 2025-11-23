import { PrismaClient } from '@prisma/client';
import { 
  Job, 
  CreateJobData, 
  JobFilters, 
  JobProfitability 
} from '../models/Job';

export class JobService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllJobs(filters: JobFilters) {
    const { page, limit, status, customerId, dateFrom, dateTo } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    
    if (dateFrom || dateTo) {
      where.scheduledStart = {};
      if (dateFrom) where.scheduledStart.gte = new Date(dateFrom);
      if (dateTo) where.scheduledStart.lte = new Date(dateTo);
    }

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { scheduledStart: 'asc' },
        include: {
          customer: {
            select: {
              companyName: true,
              contactName: true
            }
          },
          jobAssignments: {
            include: {
              engineer: true
            }
          }
        }
      }),
      this.prisma.job.count({ where })
    ]);

    return {
      jobs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getJobById(id: string): Promise<Job | null> {
    return this.prisma.job.findUnique({
      where: { id },
      include: {
        customer: true,
        jobAssignments: {
          include: {
            engineer: true
          }
        },
        jobCosts: true,
        invoices: true
      }
    });
  }

  async createJob(data: CreateJobData): Promise<Job> {
    return this.prisma.job.create({
      data: {
        ...data,
        status: 'SCHEDULED'
      },
      include: {
        customer: true
      }
    });
  }

  async updateJobStatus(id: string, status: string): Promise<Job> {
    return this.prisma.job.update({
      where: { id },
      data: { status },
      include: {
        customer: true
      }
    });
  }

  async calculateJobProfitability(jobId: string): Promise<JobProfitability> {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        jobAssignments: {
          include: {
            engineer: true
          }
        },
        jobCosts: true,
        invoices: true
      }
    });

    if (!job) {
      throw new Error('Job not found');
    }

    // Calculate labour costs
    const labourCost = job.jobAssignments.reduce((total, assignment) => {
      const hours = assignment.actualHours || assignment.assignedHours || 0;
      return total + (hours * assignment.engineer.hourlyRate);
    }, 0);

    // Calculate other costs
    const materialCost = job.jobCosts
      .filter(cost => cost.costType === 'MATERIALS')
      .reduce((total, cost) => total + cost.amount, 0);

    const travelCost = job.jobCosts
      .filter(cost => cost.costType === 'TRAVEL')
      .reduce((total, cost) => total + cost.amount, 0);

    const subcontractorCost = job.jobCosts
      .filter(cost => cost.costType === 'SUBCONTRACTOR')
      .reduce((total, cost) => total + cost.amount, 0);

    const otherCost = job.jobCosts
      .filter(cost => cost.costType === 'OTHER')
      .reduce((total, cost) => total + cost.amount, 0);

    // Calculate revenue from invoices
    const revenue = job.invoices
      .filter(invoice => invoice.status === 'PAID')
      .reduce((total, invoice) => total + invoice.amount, 0);

    const totalCosts = labourCost + materialCost + travelCost + subcontractorCost + otherCost;
    const profit = revenue - totalCosts;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

    return {
      jobId,
      revenue,
      costs: {
        labour: labourCost,
        materials: materialCost,
        travel: travelCost,
        subcontractor: subcontractorCost,
        other: otherCost
      },
      totalCosts,
      profit,
      margin: Number(margin.toFixed(1))
    };
  }
}
