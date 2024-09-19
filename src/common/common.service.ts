import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseModel } from './entity/base.entity';
import { BasePaginationDto } from './dto/base-pagination.dto';
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { FILTER_MAPPER } from './const/filter-mapper.const';

interface OperatorValue {
  '@instanceof': symbol;
  _type: string;
  _value: any;
  _useParameter: boolean;
  _multipleParameters: boolean;
  _getSql: any;
  _objectLiteralParameters: any;
}

function isOperatorValue(value: any): value is OperatorValue {
  return (
    typeof value === 'object' &&
    value !== null &&
    '@instanceof' in value &&
    '_type' in value &&
    '_value' in value
  );
}

@Injectable()
export class CommonService {
  paginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideOptions: FindManyOptions<T>,
    path: string,
    queryBuilder?: SelectQueryBuilder<T>, // queryBuilder를 선택적 매개변수로 추가
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
    overrideOptions: FindManyOptions<T>,
    path: string,
    queryBuilder?: SelectQueryBuilder<T>, // queryBuilder를 선택적 매개변수로 추가
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
            if (key !== 'where__id__more_than') {
              nextUrl.searchParams.append(key, dto[key]);
            }
          }
        }

        let key: keyof PaginationDto = null;

        if (dto.order__createdAt === 'ASC') {
          key = 'where__id__more_than';
        } else {
          key = 'where__id__less_than';
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
    overrideOptions: FindManyOptions<T> = {},
    queryBuilder?: SelectQueryBuilder<T>, // queryBuilder를 선택적 매개변수로 추가
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
    overrideOptions: FindManyOptions<T>,
    existingQueryBuilder?: SelectQueryBuilder<T>, // 기존 queryBuilder를 선택적 매개변수로 추가
  ) {
    const modifiedOptions = this.composeModifiedOptions(dto, overrideOptions);
    const queryBuilder =
      existingQueryBuilder || repository.createQueryBuilder('entity');
    const alias = queryBuilder.alias; // alias를 동적으로 가져옴

    // 기존 queryBuilder가 있을 경우에도 dto, repository, overrideOptions 적용
    this.applyWhereConditions(queryBuilder, modifiedOptions.where, alias);
    this.applyOrderConditions(queryBuilder, modifiedOptions.order, alias);
    this.applyTakeCondition(queryBuilder, modifiedOptions.take);
    this.applyRelations(queryBuilder, modifiedOptions.relations, alias);

    return queryBuilder;
  }

  private applyWhereConditions(queryBuilder: any, where: any[], alias: string) {
    if (Array.isArray(where) && where.length > 0) {
      where.forEach((whereClause, index) => {
        Object.entries(whereClause).forEach(([key, value]) => {
          if (isOperatorValue(value)) {
            this.applyOperator(queryBuilder, key, value, index, alias);
          } else if (typeof value === 'object' && value !== null) {
            Object.entries(value).forEach(([subKey, subValue]) => {
              if (isOperatorValue(subValue)) {
                this.applyOperator(
                  queryBuilder,
                  `${key}.${subKey}`,
                  subValue,
                  index,
                  alias,
                  true,
                );
              }
            });
          }
        });
      });
    }
  }

  private applyOperator(
    queryBuilder: any,
    key: string,
    value: OperatorValue,
    index: number,
    alias: string,
    isNested: boolean = false,
  ) {
    const operator = value._type;
    const operand = value._value;
    const paramKey = `${key.replace('.', '_')}_${index}`;

    switch (operator) {
      case 'ilike':
        queryBuilder.orWhere(`${alias}.${key} ILIKE :${paramKey}`, {
          [paramKey]: operand,
        });
        break;
      case 'equal':
        if (isNested) {
          queryBuilder.andWhere(`${alias}.${key} = :${paramKey}`, {
            [paramKey]: operand,
          });
        } else {
          queryBuilder.orWhere(`${alias}.${key} = :${paramKey}`, {
            [paramKey]: operand,
          });
        }
        break;
      // 필요에 따라 다른 연산자 추가
      default:
        queryBuilder.orWhere(`${alias}.${key} = :${paramKey}`, {
          [paramKey]: operand,
        });
    }
  }

  private applyOrderConditions(
    queryBuilder: any,
    order: FindOptionsOrder<any>,
    alias: string,
  ) {
    if (order) {
      Object.entries(order).forEach(([key, value]) => {
        queryBuilder.addOrderBy(`${alias}.${key}`, value as 'ASC' | 'DESC');
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
    overrideOptions: FindManyOptions<T>,
  ) {
    const findOptions = this.composeFindOptions<T>(dto, overrideOptions);
    const overrideWhereOption = overrideOptions.where as FindOptionsWhere<T>;
    const findOptionsWhere = findOptions.where as FindOptionsWhere<T>[];
    return {
      ...findOptions,
      ...overrideOptions,
      relations: {
        ...findOptions.relations,
        ...overrideOptions.relations,
      },
      where: findOptionsWhere.map((where) => {
        return {
          ...where,
          ...overrideWhereOption,
        };
      }),
      order: {
        ...findOptions.order,
        ...overrideOptions.order,
      },
      select: {
        ...findOptions.select,
        ...overrideOptions.select,
      },
    };
  }

  private composeFindOptions<T extends BaseModel>(
    dto: BasePaginationDto,
    overrideOption: FindManyOptions<T> = {},
  ): FindManyOptions<T> {
    let where: FindOptionsWhere<T>[] = [];
    let order: FindOptionsOrder<T> = {};

    for (const [key, value] of Object.entries(dto)) {
      if (key.startsWith('where__and')) continue;
      if (key.startsWith('where__')) {
        const parsedNewWhere = this.parseFindOptionsFilter(
          key,
          value,
        ) as FindOptionsWhere<T>;
        where = [...where, { ...parsedNewWhere, ...overrideOption.where }];
      } else if (key.startsWith('order__')) {
        order = {
          ...order,
          ...this.parseFindOptionsFilter(key, value),
        };
      }
    }
    if (where.length === 0) {
      where = [{}];
    }

    for (const [key, value] of Object.entries(dto)) {
      if (key.startsWith('where__and')) {
        const parsedNewWhere = this.parseFindOptionsFilter(
          key,
          value,
        ) as FindOptionsWhere<T>;
        where = where.map((w) => {
          return {
            ...w,
            ...parsedNewWhere,
          };
        });
      }
    }

    return {
      where,
      order,
      take: dto.take,
      skip: dto.page ? dto.take * (dto.page - 1) : null,
    };
  }

  private parseFindOptionsFilter<T extends BaseModel>(
    key: string,
    value: any,
  ): FindOptionsWhere<T> | FindOptionsOrder<T> {
    const options: FindOptionsWhere<T> | FindOptionsOrder<T> = {};
    /**
     * ['where', 'id', 'more_than']
     */
    const split = key.split('__');
    if (split[1] === 'and') {
      // split[1] 의 값이 and 일 경우에는 제거한다.
      split.splice(1, 1);
    }

    if (!(split.length >= 2 && split.length <= 5)) {
      throw new BadRequestException(
        `where 필터는 '__'로 split 했을때 길이가 2 ~ 5 사이여야합니다 - 문제되는 키값 : ${key}`,
      );
    }

    if (split.length === 2) {
      // ['where', 'id']
      const [, field] = split;
      options[field] = value;
    } else if (split.length === 3) {
      // ['where', 'id', 'more_than']
      const [_, field, operator] = split;
      if (operator === 'i_like') {
        options[field] = FILTER_MAPPER[operator](`%${value}%`);
      } else {
        options[field] = FILTER_MAPPER[operator](value);
      }
    } else if (split.length === 4) {
      // ['where', 'status', 'id', 'equal']
      const [_, relation, field, operator] = split;
      if (!options[relation]) {
        options[relation] = {};
      }
      options[relation] = { [field]: FILTER_MAPPER[operator](value) };
    }
    return options;
  }
}
