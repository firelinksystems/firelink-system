import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from '../entities/contract.entity';
import { ContractSite } from '../entities/contract-site.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { GenerateJobsDto } from './dto/generate-jobs.dto';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>,
    @InjectRepository(ContractSite)
    private contractSitesRepository: Repository<ContractSite>,
  ) {}

  async create(createContractDto: CreateContractDto): Promise<Contract> {
    const contract = this.contractsRepository.create({
      customer_id: createContractDto.customer_id,
      contract_type_id: createContractDto.contract_type_id,
      start_date: createContractDto.start_date,
      end_date: createContractDto.end_date,
      value: createContractDto.value,
      auto_renew: createContractDto.auto_renew,
      terms_and_conditions: createContractDto.terms_and_conditions,
    });

    const savedContract = await this.contractsRepository.save(contract);

    // Link sites to contract
    if (createContractDto.site_ids && createContractDto.site_ids.length > 0) {
      await this.linkSitesToContract(savedContract.id, createContractDto.site_ids);
    }

    return this.findOne(savedContract.id);
  }

  async findAll(): Promise<Contract[]> {
    return await this.contractsRepository.find({
      relations: ['customer', 'contract_type', 'contract_sites', 'contract_sites.site'],
      order: { created_at: 'DESC' },
    });
  }

  async findByCustomer(customerId: string): Promise<Contract[]> {
    return await this.contractsRepository.find({
      where: { customer: { id: customerId } },
      relations: ['contract_type', 'contract_sites', 'contract_sites.site'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Contract> {
    const contract = await this.contractsRepository.findOne({
      where: { id },
      relations: [
        'customer',
        'contract_type',
        'contract_sites',
        'contract_sites.site',
        'jobs',
      ],
    });

    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }

    return contract;
  }

  async generateJobs(id: string, generateJobsDto: GenerateJobsDto): Promise<any> {
    const contract = await this.findOne(id);
    
    // Implementation for manual job generation
    // This would create jobs based on the contract schedule
    
    return {
      contract_id: id,
      jobs_generated: 0, // Placeholder
      message: 'Job generation completed',
    };
  }

  async renewContract(id: string): Promise<Contract> {
    const contract = await this.findOne(id);
    
    if (contract.end_date) {
      const newEndDate = new Date(contract.end_date);
      newEndDate.setFullYear(newEndDate.getFullYear() + 1);
      contract.end_date = newEndDate;
    }

    contract.status = 'active';
    return await this.contractsRepository.save(contract);
  }

  private async linkSitesToContract(contractId: string, siteIds: string[]) {
    const contractSites = siteIds.map(siteId => ({
      contract_id: contractId,
      site_id: siteId,
    }));

    await this.contractSitesRepository.save(contractSites);
  }
}
