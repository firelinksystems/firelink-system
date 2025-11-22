import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from '../entities/asset.entity';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private assetsRepository: Repository<Asset>,
  ) {}

  async create(createAssetDto: CreateAssetDto): Promise<Asset> {
    const asset = this.assetsRepository.create(createAssetDto);
    return await this.assetsRepository.save(asset);
  }

  async findAll(): Promise<Asset[]> {
    return await this.assetsRepository.find({
      relations: ['site', 'asset_type', 'site.customer'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Asset> {
    const asset = await this.assetsRepository.findOne({
      where: { id },
      relations: ['site', 'asset_type', 'site.customer', 'defects'],
    });

    if (!asset) {
      throw new NotFoundException(`Asset with ID ${id} not found`);
    }

    return asset;
  }

  async findBySite(siteId: string): Promise<Asset[]> {
    return await this.assetsRepository.find({
      where: { site: { id: siteId } },
      relations: ['asset_type'],
      order: { name: 'ASC' },
    });
  }

  async update(id: string, updateAssetDto: UpdateAssetDto): Promise<Asset> {
    const asset = await this.findOne(id);
    Object.assign(asset, updateAssetDto);
    return await this.assetsRepository.save(asset);
  }

  async remove(id: string): Promise<void> {
    const asset = await this.findOne(id);
    await this.assetsRepository.remove(asset);
  }

  async getMaintenanceHistory(assetId: string): Promise<any[]> {
    // Implementation to get job history for this asset
    // This would query jobs that included this asset
    return [];
  }

  async getDueForInspection(): Promise<Asset[]> {
    const today = new Date();
    return await this.assetsRepository.find({
      where: {
        next_inspection_date: new Date(today.setDate(today.getDate() + 30)), // Next 30 days
        status: 'active',
      },
      relations: ['site', 'site.customer'],
    });
  }
}
