import { IsString, IsEmail, IsOptional, IsUUID, IsPostalCode } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'ABC Manufacturing Ltd' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ required: false, example: 'contact@abcmfg.com' })
  @IsOptional()
  @IsEmail()
  contact_email?: string;

  @ApiProperty({ required: false, example: '+441234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, example: '123 Industrial Estate, London' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false, example: 'SW1A 1AA' })
  @IsOptional()
  @IsPostalCode('GB')
  postcode?: string;

  @ApiProperty({ required: false, default: 'UK' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  account_manager_id?: string;
}
