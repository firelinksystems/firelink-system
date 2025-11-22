import { IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateJobsDto {
  @ApiProperty({ required: false, example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  from_date?: string;

  @ApiProperty({ required: false, example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  to_date?: string;
}
