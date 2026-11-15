import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ProductStatus } from '../schemas/product.schema';

export class CreateProductDto {
  @ApiProperty({ example: 'Syntecx Edge Gateway Pro X1', description: 'Product display name' })
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  @MinLength(2)
  @MaxLength(140)
  name: string;

  @ApiProperty({ example: 1299.99, description: 'Unit price in USD', minimum: 0 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a valid number' })
  @Min(0, { message: 'Price cannot be negative' })
  price: number;

  @ApiProperty({
    example: 'High-throughput industrial edge gateway with dual 10GbE SFP+ ports and hardware TPM 2.0 encryption.',
    description: 'Detailed product specification',
  })
  @IsString()
  @IsNotEmpty({ message: 'Product description is required' })
  @MinLength(10, { message: 'Description must be at least 10 characters' })
  @MaxLength(2000)
  description: string;

  @ApiProperty({ example: 'Network Hardware', description: 'Inventory category' })
  @IsString()
  @IsNotEmpty({ message: 'Category is required' })
  category: string;

  @ApiPropertyOptional({ example: '/uploads/product-gateway-x1.svg', description: 'Product image URL or path' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ example: 'SYN-NET-8820', description: 'Unique stock keeping unit code' })
  @IsString()
  @IsNotEmpty({ message: 'SKU is required' })
  @Matches(/^[A-Za-z0-9\-_]{3,32}$/, {
    message: 'SKU must be 3-32 alphanumeric characters, hyphens, or underscores',
  })
  sku: string;

  @ApiProperty({ example: 42, description: 'Available stock units', minimum: 0 })
  @Type(() => Number)
  @IsInt({ message: 'Stock quantity must be an integer' })
  @Min(0, { message: 'Stock quantity cannot be negative' })
  stockQuantity: number;

  @ApiPropertyOptional({ enum: ProductStatus, description: 'Inventory availability status' })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}
