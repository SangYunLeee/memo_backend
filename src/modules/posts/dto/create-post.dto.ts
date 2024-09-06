import { PickType } from '@nestjs/mapped-types';
import { PostsModel } from '../entities/post.entity';
import { IsOptional, IsNumber } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export class CreatePostDto extends PickType(PostsModel, [
  'title',
  'content',
  'contentSlate',
]) {
  @IsOptional()
  @IsNumber()
  statusId: number = 2;

  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
