import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { JobForm } from '../entities/job-form.entity';
import { FormTemplate } from '../entities/form-template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobForm, FormTemplate])],
  controllers: [FormsController],
  providers: [FormsService],
  exports: [FormsService],
})
export class FormsModule {}
