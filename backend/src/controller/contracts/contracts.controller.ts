import { Controller, Get, Post, Body, Patch, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { GenerateJobsDto } from './dto/generate-jobs.dto';

@ApiTags('FireLink - Contracts')
@ApiBearerAuth()
@Controller('contracts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'FireLink Systems - Create a new contract' })
  async create(@Body() createContractDto: CreateContractDto) {
    return this.contractsService.create(createContractDto);
  }

  @Get()
  @ApiOperation({ summary: 'FireLink Systems - Get all contracts' })
  async findAll() {
    return this.contractsService.findAll();
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'FireLink Systems - Get contracts by customer' })
  async findByCustomer(@Param('customerId', ParseUUIDPipe) customerId: string) {
    return this.contractsService.findByCustomer(customerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'FireLink Systems - Get contract by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.contractsService.findOne(id);
  }

  @Post(':id/generate-jobs')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'FireLink Systems - Generate jobs for contract' })
  async generateJobs(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() generateJobsDto: GenerateJobsDto,
  ) {
    return this.contractsService.generateJobs(id, generateJobsDto);
  }

  @Patch(':id/renew')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'FireLink Systems - Renew contract' })
  async renewContract(@Param('id', ParseUUIDPipe) id: string) {
    return this.contractsService.renewContract(id);
  }
}
