import { IsUUID, IsString, IsOptional, IsDateString, IsNumber, Min, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty()
  @IsUUID()
  site_id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  contract_id?: string;

  @ApiProperty()
  @IsUUID()
  job_type_id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  assigned_technician_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  parent_job_id?: string;

  @ApiProperty({ example: 'Quarterly Fire Alarm Inspection' })
  @IsString()
  title: string;

  @ApiProperty({ required: false, example: 'Routine quarterly inspection of all fire alarm systems' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, enum: ['low', 'medium', 'high', 'emergency'], default: 'medium' })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high', 'emergency'])
  priority?: string;

  @ApiProperty({ required: false, example: '2024-01-15T09:00:00Z' })
  @IsOptional()
  @IsDateString()
  scheduled_date?: string;

  @ApiProperty({ required: false, example: '2024-01-15T09:00:00Z' })
  @IsOptional()
  @IsDateString()
  scheduled_start_time?: string;

  @ApiProperty({ required: false, example: '2024-01-15T17:00:00Z' })
  @IsOptional()
  @IsDateString()
  scheduled_end_time?: string;

  @ApiProperty({ required: false, example: 4.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimated_hours?: number;

  @ApiProperty({ required: false, example: 'Please ensure all areas are accessible' })
  @IsOptional()
  @IsString()
  customer_notes?: string;

  @ApiProperty({ required: false, example: 'Bring ladder for high-level detectors' })
  @IsOptional()
  @IsString()
  internal_notes?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsUUID('4', { each: true })
  asset_ids?: string[];
}
