import { IsUUID, IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDefectDto {
  @ApiProperty()
  @IsUUID()
  job_id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  asset_id?: string;

  @ApiProperty({ example: 'Faulty smoke detector in reception' })
  @IsString()
  title: string;

  @ApiProperty({ required: false, example: 'Smoke detector not responding to test. Requires replacement.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high', 'critical'])
  severity?: string;

  @ApiProperty({ required: false, example: 'Replace smoke detector unit' })
  @IsOptional()
  @IsString()
  recommended_action?: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  safety_implications?: boolean;
}
