import { IsEnum, IsOptional, IsDateString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JobStatusDto {
  @ApiProperty({ enum: ['scheduled', 'assigned', 'in_progress', 'completed', 'cancelled'] })
  @IsEnum(['scheduled', 'assigned', 'in_progress', 'completed', 'cancelled'])
  status: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  actual_start_time?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  actual_end_time?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  actual_hours?: number;
}
