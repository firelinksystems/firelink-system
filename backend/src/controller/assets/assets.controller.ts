import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@ApiTags('FireLink - Assets')
@ApiBearerAuth()
@Controller('assets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'FireLink Systems - Create a new asset' })
  async create(@Body() createAssetDto: CreateAssetDto) {
    return this.assetsService.create(createAssetDto);
  }

  @Get()
  @ApiOperation({ summary: 'FireLink Systems - Get all assets' })
  async findAll() {
    return this.assetsService.findAll();
  }

  @Get('site/:siteId')
  @ApiOperation({ summary: 'FireLink Systems - Get assets by site' })
  async findBySite(@Param('siteId', ParseUUIDPipe) siteId: string) {
    return this.assetsService.findBySite(siteId);
  }

  @Get('due-for-inspection')
  @ApiOperation({ summary: 'FireLink Systems - Get assets due for inspection' })
  async getDueForInspection() {
    return this.assetsService.getDueForInspection();
  }

  @Get(':id')
  @ApiOperation({ summary: 'FireLink Systems - Get asset by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.assetsService.findOne(id);
  }

  @Get(':id/maintenance-history')
  @ApiOperation({ summary: 'FireLink Systems - Get asset maintenance history' })
  async getMaintenanceHistory(@Param('id', ParseUUIDPipe) id: string) {
    return this.assetsService.getMaintenanceHistory(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.TECHNICIAN)
  @ApiOperation({ summary: 'FireLink Systems - Update asset' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAssetDto: UpdateAssetDto,
  ) {
    return this.assetsService.update(id, updateAssetDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'FireLink Systems - Delete asset' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.assetsService.remove(id);
  }
}
