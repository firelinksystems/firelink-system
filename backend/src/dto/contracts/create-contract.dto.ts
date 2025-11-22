import { IsUUID, IsDateString, IsNumber, IsOptional, IsBoolean, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContractDto {
  @ApiProperty()
  @IsUUID()
  customer_id: string;

  @ApiProperty()
  @IsUUID()
  contract_type_id: string;

  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  start_date: string;

  @ApiProperty({ required: false, example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiProperty({ required: false, example: 5000.00 })
  @IsOptional()
  @IsNumber()
  value?: number;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  auto_renew?: boolean;

  @ApiProperty({ required: false, example: 'Standard terms and conditions apply' })
  @IsOptional()
  @IsString()
  terms_and_conditions?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  site_ids: string[];
}
