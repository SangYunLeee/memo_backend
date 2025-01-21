import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';
import { UpdateCategoryDto } from './update-category.dto';

export class UpdateCategoryListDto {
  @IsArray()
  @IsNumber({}, { each: true })
  categoryIdsToDelete: number[];

  @IsArray()
  @Type(() => CreateCategoryDto)
  categoriesToAdd: CreateCategoryDto[];

  @IsArray()
  @Type(() => UpdateCategoryDto)
  categoriesToUpdate: UpdateCategoryDto[];
}
