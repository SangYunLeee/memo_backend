import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginateCategoryDto extends BasePaginationDto {
  @IsOptional()
  @IsNumber()
  userId: number;
}
