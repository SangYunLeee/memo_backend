import { PickType } from '@nestjs/mapped-types';
import { PostsModel } from '../entities/post.entity';
import { IsOptional, IsNumber } from 'class-validator';
import { Exclude } from 'class-transformer';

export class CreatePostDtoModel extends PickType(PostsModel, [
  'title',
  'content',
  'contentSlate',
]) {
  @IsOptional()
  @IsNumber()
  statusId: number = 2;

  @IsOptional()
  @IsNumber()
  categoryId?: number = null;

  @IsOptional()
  @IsNumber()
  visibilityId?: number = 1;

  @Exclude()
  userId: number;
}
