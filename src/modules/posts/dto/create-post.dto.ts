import { PickType } from '@nestjs/mapped-types';
import { PostsModel } from '../entities/post.entity';
import { IsOptional, IsNumber } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export class CreatePostDto extends PickType(PostsModel, [
  'title',
  'content',
  'contentSlate',
]) {
  @Expose()
  @Transform(({ value }) => {
    return value !== undefined ? value : 2; // published
  })
  @IsOptional()
  @IsNumber()
  statusId: number;
}
