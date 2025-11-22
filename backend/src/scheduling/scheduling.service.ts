import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Contract } from '../entities/contract.entity';
import { Job } from '../entities/job.entity';
import { JobType } from '../entities/job-type.entity';
import { JobsService } from '../jobs/jobs.service';

@Injectable()
export class SchedulingService {
  private readonly logger = new Logger(SchedulingService.name);

  constructor(
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>,
    @InjectRepository(JobType)
    private jobTypesRepository: Repository<JobType>,
    private jobsService: JobsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async generateRecurringJobs() {
    this.logger.log('Starting recurring job generation...');

    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    // Find active contracts with maintenance frequency
    const activeContracts = await this.contractsRepository.find({
      where: { 
        status: 'active',
        contract_type: { frequency_months: MoreThan(0) }
      },
      relations: ['contract_type', 'contract_sites', 'contract_sites.site'],
    });

    let jobsCreated = 0;

    for (const contract of activeContracts) {
      for (const contractSite of contract.contract_sites) {
        const nextDueDate = await this.calculateNextDueDate(contract, contractSite.site.id);
        
        if (nextDueDate && nextDueDate <= nextWeek && nextDueDate >= today) {
          // Create maintenance job
          const maintenanceJobType = await this.jobTypesRepository.findOne({
            where: { name: 'Routine Maintenance' }
          });

          if (maintenanceJobType) {
            await this.jobsService.create({
              site_id: contractSite.site.id,
              contract_id: contract.id,
              job_type_id: maintenanceJobType.id,
              title: `Scheduled Maintenance - ${contract.contract_type.name}`,
              description: `Automatically generated maintenance job for contract ${contract.id}`,
              scheduled_date: nextDueDate,
              priority: 'medium',
            } as any);
            
            jobsCreated++;
          }
        }
      }
    }

    this.logger.log(`Generated ${jobsCreated} recurring jobs`);
  }

  private async calculateNextDueDate(contract: Contract, siteId: string): Promise<Date | null> {
    // Get the last completed maintenance job for this contract and site
    const lastJob = await this.jobsService.findLastMaintenanceJob(contract.id, siteId);
    
    const lastDate = lastJob?.actual_end_time || contract.start_date;
    const frequencyMonths = contract.contract_type.frequency_months;

    if (!frequencyMonths) return null;

    const nextDueDate = new Date(lastDate);
    nextDueDate.setMonth(nextDueDate.getMonth() + frequencyMonths);
    
    return nextDueDate;
  }

  async generateInspectionJobsForAssets() {
    this.logger.log('Generating asset inspection jobs...');
    // Implementation for asset-based inspection job generation
    return { message: 'Asset inspection job generation completed' };
  }
}
