import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  Min,
  IsMongoId,
} from 'class-validator';
export class CreateProductDto {
  @IsString()
  name: string;
  @IsString()
  slug: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsMongoId()
  category: string; // The ID of the category

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
