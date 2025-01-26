import { BaseModel } from '../entity/base.entity';

export type OrderCondition<T extends BaseModel> = {
  target: keyof T;
  value: 'ASC' | 'DESC';
}[];

export type WhereOrCondition<T extends BaseModel> = {
  target: keyof T;
  value: number | string | number[];
  operator: string;
}[];

export class SearchCondition<ModelType extends BaseModel> {
  whereList?: WhereOrCondition<ModelType>[];
  orderList?: OrderCondition<ModelType>[];
  page?: number;
  take?: number;
  skip?: number;
  stopFlag?: boolean;
  constructor(
    public params: {
      whereList?: WhereOrCondition<ModelType>[];
      orderList?: OrderCondition<ModelType>[];
      page?: number;
      take?: number;
      skip?: number;
      stopFlag?: boolean;
    },
  ) {
    this.whereList = params.whereList;
    this.orderList = params.orderList;
    this.page = params.page;
    this.take = params.take;
    this.skip = params.skip;
    this.stopFlag = params.stopFlag;
  }
}
