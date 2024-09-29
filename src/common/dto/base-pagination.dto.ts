import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { BasePaginationConverter } from './base-pagination.dtoConverter';
import { BaseModel } from '../entity/base.entity';
import { Exclude } from 'class-transformer';
export abstract class BasePaginationDto {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  id_gt?: number;

  @IsNumber()
  @IsOptional()
  id_lt?: number;

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order?: 'ASC' | 'DESC' = 'ASC';

  @IsNumber()
  @IsOptional()
  take?: number;

  @IsString()
  @IsOptional()
  search?: string;

  @Exclude()
  userId?: number;

  stopFlag: boolean;

  assign<P_DTO extends BasePaginationDto>(params: Partial<P_DTO>) {
    Object.assign(this, params);
  }

  getConverter<
    T extends BasePaginationDto,
    MODEL extends BaseModel,
  >(): BasePaginationConverter<T, MODEL> {
    return new BasePaginationConverter();
  }
}
