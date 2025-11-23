import { PrismaClient } from '@prisma/client';
import { Engineer, JobAssignment } from '../models/Engineer';

export class SchedulingService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAvailableEngineers(filters: { date?: string; skills?: string }) {
    const { date, skills } = filters;
    
    let where: any = { isActive: true };
    
    if (skills) {
      const skillArray = skills.split(',');
      where.skills = {
        hasSome: skillArray
      };
    }

    const engineers = await this.prisma.engineer.findMany({
      where,
      include: {
        jobAssignments: {
          where: date ? {
            job: {
              scheduledStart: {
                gte: new Date(date + 'T00:00:00Z'),
                lte: new Date(date + 'T23:59:59Z')
              }
            }
          } : {},
          include: {
            job: true
          }
        }
      }
    });

    return engineers.map(engineer => ({
      ...engineer,
      availability: this.calculateAvailability(engineer, date)
    }));
  }

  async assignEngineerToJob(data: {
    jobId: string;
    engineerId: string;
    assignedHours?: number;
    role: string;
  }): Promise<JobAssignment> {
    return this.prisma.jobAssignment.create({
      data: {
        ...data,
        assignedAt: new Date()
      },
      include: {
        engineer: true,
        job: {
          include: {
            customer: true
          }
        }
      }
    });
  }

  async getScheduleCalendar(filters: { startDate?: string; endDate?: string }) {
    const { startDate, endDate } = filters;
    
    const where: any = {};
    
    if (startDate || endDate) {
      where.scheduledStart = {};
      if (startDate) where.scheduledStart.gte = new Date(startDate);
      if (endDate) where.scheduledStart.lte = new Date(endDate);
    }

    const jobs = await this.prisma.job.findMany({
      where,
      include: {
        customer: {
          select: {
            companyName: true
          }
        },
        jobAssignments: {
          include: {
            engineer: true
          }
        }
      },
      orderBy: { scheduledStart: 'asc' }
    });

    return jobs.map(job => ({
      id: job.id,
      jobId: job.id,
      title: job.title,
      start: job.scheduledStart,
      end: job.scheduledEnd,
      engineer: job.jobAssignments[0]?.engineer.name || 'Unassigned',
      customer: job.customer.companyName,
      status: job.status.toLowerCase()
    }));
  }

  async updateJobSchedule(jobId: string, data: { scheduledStart?: Date; scheduledEnd?: Date }) {
    return this.prisma.job.update({
      where: { id: jobId },
      data,
      include: {
        customer: true,
        jobAssignments: {
          include: {
            engineer: true
          }
        }
      }
    });
  }

  private calculateAvailability(engineer: any, date?: string) {
    // Simple availability calculation
    // In a real application, this would consider working hours, holidays, etc.
    const today = date ? new Date(date) : new Date();
    const availability: { [key: string]: string[] } = {};

    // Generate availability for the next 7 days
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      const dateKey = currentDate.toISOString().split('T')[0];
      
      // Mock available slots (9 AM to 5 PM with 1-hour slots)
      availability[dateKey] = ['09:00-10:00', '10:00-11:00', '11:00-12:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'];
    }

    return availability;
  }
}
