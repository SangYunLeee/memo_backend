import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';

export class PaginatePostDtoModel extends BasePaginationDto {
  @IsString()
  @IsOptional()
  where__content__i_like: string;

  @IsString()
  @IsOptional()
  where__title__i_like: string;

  @IsNumber()
  @IsOptional()
  where__and__status__id__equal: number = 2; // published

  @IsNumber()
  @IsOptional()
  where__and__author__id__equal: number;

  @IsString()
  @IsOptional()
  nickname: string;

  @IsNumber()
  @IsOptional()
  where__and__category__id__equal: number;

  @Exclude()
  userId?: number;
}
