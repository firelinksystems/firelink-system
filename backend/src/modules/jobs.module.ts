import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { Job } from '../entities/job.entity';
import { JobAsset } from '../entities/job-asset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, JobAsset])],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
