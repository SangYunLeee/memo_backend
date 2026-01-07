import { PickType } from '@nestjs/swagger';
import { PostsModel } from '../entities/post.entity';
import { IsOptional, IsNumber } from 'class-validator';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDtoModel extends PickType(PostsModel, [
  'title',
  'content',
  'contentSlate',
]) {
  @ApiProperty({
    description: '게시글 상태 ID (1: 임시저장, 2: 발행됨)',
    example: 2,
    default: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  statusId: number = 2;

  @ApiProperty({
    description: '카테고리 ID',
    example: 1,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  categoryId?: number = null;

  @ApiProperty({
    description: '공개 범위 ID (1: 전체공개, 2: 비공개)',
    example: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  visibilityId?: number = 1;

  @Exclude()
  userId: number;
}
