import { BaseModel } from '../entity/base.entity';
import { BasePaginationDto } from './base-pagination.dto';
import { SearchCondition } from './base-pagination.type';

export class BasePaginationConverter<
  DTO extends BasePaginationDto,
  MODEL extends BaseModel,
> {
  static baseMappings: Partial<
    Record<
      keyof BasePaginationDto,
      {
        where?: [keyof BaseModel, string][];
        order?: [keyof BaseModel][];
      }
    >
  > = {
    id_gt: { where: [['id', 'more_than']] },
    id_lt: { where: [['id', 'less_than']] },
    order: { order: [['createdAt']] },
  };

  static queryMap = {
    more_than: ['>', (value: string) => value],
    less_than: ['<', (value: string) => value],
    equal: ['=', (value: string) => value],
    include: ['ILIKE', (value: string) => `%${value}%`],
  };

  getMappings(): Partial<
    Record<
      keyof DTO,
      {
        where?: [keyof MODEL, string][];
        order?: [keyof MODEL][];
      }
    >
  > {
    return BasePaginationConverter.baseMappings as any;
  }

  convert(dto: DTO): SearchCondition<MODEL> {
    const mappings = this.getMappings();
    const result = new SearchCondition<MODEL>({
      whereList: [],
      orderList: [],
      page: dto.page,
      take: dto.take,
    });
    Object.keys(mappings).forEach((key) => {
      if (dto[key] !== undefined) {
        if (mappings[key].where) {
          result.whereList.push(
            mappings[key].where.map((item: [keyof MODEL, string]) => ({
              target: item[0],
              value: BasePaginationConverter.queryMap[item[1]][1](dto[key]),
              operator: BasePaginationConverter.queryMap[item[1]][0],
            })),
          );
        }
        if (mappings[key].order) {
          result.orderList.push(
            mappings[key].order.map((item: [keyof MODEL]) => ({
              target: item[0],
              value: dto[key],
            })),
          );
        }
      }
    });
    return new SearchCondition<MODEL>({
      ...result,
      page: dto.page,
      take: dto.take,
      stopFlag: dto.stopFlag,
    });
  }
}
