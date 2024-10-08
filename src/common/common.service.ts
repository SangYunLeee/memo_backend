import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseModel } from './entity/base.entity';
import {
  Brackets,
  FindManyOptions,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { BasePaginationDto } from './dto/base-pagination.dto';
import {
  OrderCondition,
  SearchCondition,
  WhereOrCondition,
} from './dto/base-pagination.type';

@Injectable()
export class CommonService {
  paginate<T extends BaseModel, DTO extends BasePaginationDto>(
    dto: DTO,
    repository: Repository<T>,
    overrideOptions: SearchCondition<T>,
    path: string,
    queryBuilder?: SelectQueryBuilder<T>,
  ) {
    if (dto.page) {
      return this.pagePaginate(dto, repository, overrideOptions, queryBuilder);
    }
    return this.cusorPaginate(
      dto,
      repository,
      overrideOptions,
      path,
      queryBuilder,
    );
  }

  private async cusorPaginate<
    T extends BaseModel,
    PaginationDto extends BasePaginationDto,
  >(
    dto: PaginationDto,
    repository: Repository<T>,
    overrideOptions: SearchCondition<T>,
    path: string,
    queryBuilder?: SelectQueryBuilder<T>,
  ) {
    queryBuilder = this.createQueryBuilder(
      dto,
      repository,
      overrideOptions,
      queryBuilder,
    );

    try {
      const results = !dto.stopFlag ? await queryBuilder.getMany() : [];

      const lastItem =
        results.length > 0 && results.length === dto.take
          ? results[results.length - 1]
          : null;

      const nextUrl = lastItem && new URL(`${process.env.BACKEND_URL}/${path}`);

      if (lastItem) {
        for (const key of Object.keys(dto)) {
          if (dto[key]) {
            if (key !== 'id_gt') {
              nextUrl.searchParams.append(key, dto[key]);
            }
          }
        }

        let key: keyof PaginationDto = null;

        if (dto.order === 'ASC') {
          key = 'id_gt';
        } else {
          key = 'id_lt';
        }

        nextUrl.searchParams.append(key, lastItem.id.toString());
      }

      return {
        data: results,
        cursor: {
          after: lastItem?.id ?? null,
        },
        count: results.length,
        next: nextUrl?.toString() ?? null,
      };
    } catch (error) {
      console.error('Error in cusorPaginate:', error);
      console.error('SQL:', queryBuilder.getQuery());
      console.error('Parameters:', queryBuilder.getParameters());
      throw error;
    }
  }

  private async pagePaginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideOptions: SearchCondition<T>,
    queryBuilder?: SelectQueryBuilder<T>,
  ) {
    queryBuilder = this.createQueryBuilder(
      dto,
      repository,
      overrideOptions,
      queryBuilder,
    );

    try {
      const [data, count] = !dto.stopFlag
        ? await queryBuilder.getManyAndCount()
        : [[], 0];

      return {
        data,
        total: count,
      };
    } catch (error) {
      console.error('Error in pagePaginate:', error);
      console.error('SQL:', queryBuilder.getQuery());
      console.error('Parameters:', queryBuilder.getParameters());
      throw error;
    }
  }

  private createQueryBuilder<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideOptions: SearchCondition<T>,
    existingQueryBuilder?: SelectQueryBuilder<T>,
  ) {
    const modifiedOptions = this.composeModifiedOptions(dto);
    const queryBuilder =
      existingQueryBuilder || repository.createQueryBuilder('entity');
    const alias = queryBuilder.alias;

    this.applyWhereConditions(queryBuilder, modifiedOptions.whereList, alias);
    this.applyOrderConditions(queryBuilder, modifiedOptions.orderList, alias);
    this.applyTakeCondition(queryBuilder, dto.take);
    return queryBuilder;
  }

  private applyWhereConditions<T extends BaseModel>(
    queryBuilder: SelectQueryBuilder<T>,
    whereList: WhereOrCondition<T>[],
    alias: string,
  ) {
    if (Array.isArray(whereList) && whereList.length > 0) {
      whereList.forEach((whereItem, index1) => {
        queryBuilder.andWhere(
          new Brackets((subQb) => {
            whereItem.forEach((whereItem, index2) => {
              const method = index2 === 0 ? 'where' : 'orWhere';
              subQb[method](
                `${alias}.${String(whereItem.target)} ${whereItem.operator} :${String(whereItem.target)}_${index1}_${index2}`,
                {
                  [`${String(whereItem.target)}_${index1}_${index2}`]:
                    whereItem.value,
                },
              );
            });
          }),
        );
      });
    }
  }

  private applyOrderConditions<T extends BaseModel>(
    queryBuilder: SelectQueryBuilder<T>,
    orderList: OrderCondition<T>[],
    alias: string,
  ) {
    if (orderList) {
      orderList.forEach((order) => {
        order.forEach((orderItem) => {
          queryBuilder.addOrderBy(
            `${alias}.${String(orderItem.target)}`,
            orderItem.value,
          );
        });
      });
    }
  }

  private applyTakeCondition(queryBuilder: any, take: number) {
    if (take) {
      queryBuilder.take(take);
    }
  }

  private applyRelations(queryBuilder: any, relations: any, alias: string) {
    if (relations) {
      Object.keys(relations).forEach((relation) => {
        queryBuilder.leftJoinAndSelect(`${alias}.${relation}`, relation);
      });
    }
  }

  private composeModifiedOptions<T extends BaseModel>(
    dto: BasePaginationDto,
    overrideOptions?: SearchCondition<T>,
  ): SearchCondition<T> {
    return dto.getConverter().convert(dto);
  }
}
