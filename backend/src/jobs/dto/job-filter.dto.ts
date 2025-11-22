import { IsOptional, IsUUID, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class JobFilterDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  technician_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  customer_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  site_id?: string;

  @ApiProperty({ required: false, enum: ['scheduled', 'assigned', 'in_progress', 'completed', 'cancelled'] })
  @IsOptional()
  @IsEnum(['scheduled', 'assigned', 'in_progress', 'completed', 'cancelled'])
  status?: string;

  @ApiProperty({ required: false, example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  from_date?: string;

  @ApiProperty({ required: false, example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  to_date?: string;
}
