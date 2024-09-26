import { PaginatePostDtoModel } from './paginte-post.dtoModel';

export class PaginatePostDto extends PaginatePostDtoModel {
  assign(params: Partial<PaginatePostDto>) {
    Object.assign(this, params);
  }
}
