import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginatePostDto extends BasePaginationDto {
  @IsString()
  @IsOptional()
  where__content__i_like: string;

  @IsString()
  @IsOptional()
  where__title__i_like: string;

  @IsNumber()
  @IsOptional()
  where__status__id__equal: number = 2; // published
}
