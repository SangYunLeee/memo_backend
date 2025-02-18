import { Exclude, Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsArray } from 'class-validator';
import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';
import { PostPaginationConverter } from './paginte-post.dtoConverter';
import { BasePaginationConverter } from 'src/common/dto/base-pagination.dtoConverter';
import { PostsModel } from '../entities/post.entity';
import { BaseModel } from 'src/common/entity/base.entity';

export class PaginatePostDto extends BasePaginationDto {
  @IsString()
  @IsOptional()
  content_include: string;

  @IsString()
  @IsOptional()
  title_include: string;

  @IsString()
  @IsOptional()
  content_or_title_include: string;

  @IsNumber()
  @IsOptional()
  status_id: number = 2; // published

  @IsNumber()
  @IsOptional()
  author_id: number;

  @IsString()
  @IsOptional()
  nickname: string;

  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const valueArray = value.split(',');
      return valueArray.map((v) => Number(v));
    }
    return value;
  })
  @IsNumber({}, { each: true })
  @IsOptional()
  category_ids: number[];

  @IsNumber()
  @IsOptional()
  take?: number = 12;

  getConverter<
    T extends BasePaginationDto,
    MODEL extends BaseModel,
  >(): BasePaginationConverter<T, MODEL> {
    return new PostPaginationConverter<T, MODEL>() as any;
  }
}
