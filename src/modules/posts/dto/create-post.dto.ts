import { CreatePostDtoModel } from './create-post.dtoModel';

export class CreatePostDto extends CreatePostDtoModel {
  assign(params: Partial<CreatePostDto>): void {
    Object.assign(this, params);
  }
}
