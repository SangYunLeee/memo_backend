import { PickType } from '@nestjs/mapped-types';
import { PostsModel } from '../entities/post.entity';

export class CreatePostDto extends PickType(PostsModel, [
  'title',
  'content',
  'contentSlate',
  'statusId',
]) {}
