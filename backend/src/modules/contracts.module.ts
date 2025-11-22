import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { Contract } from '../entities/contract.entity';
import { ContractSite } from '../entities/contract-site.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contract, ContractSite])],
  controllers: [ContractsController],
  providers: [ContractsService],
  exports: [ContractsService],
})
export class ContractsModule {}
