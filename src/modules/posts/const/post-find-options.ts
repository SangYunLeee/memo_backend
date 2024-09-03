import { FindManyOptions } from 'typeorm';
import { PostsModel } from '../entities/post.entity';

export const POST_FIND_OPTIONS: FindManyOptions<PostsModel> = {
  select: {
    id: true,
    title: true,
    content: true,
    contentSlate: true,
    createdAt: true,
  },
  where: {
    status: {
      // 정식 게시물 조회
      id: 2,
    },
  },
  relations: {
    author: true,
    status: true,
  },
};
