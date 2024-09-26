import { UpdatePostDtoModel } from './update-post.dtoModel';

export class UpdatePostDto extends UpdatePostDtoModel {
  assign(params: Partial<UpdatePostDto>): void {
    Object.assign(this, params);
  }
}
