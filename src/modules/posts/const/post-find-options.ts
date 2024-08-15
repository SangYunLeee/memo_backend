import { FindManyOptions } from 'typeorm';
import { PostsModel } from '../entities/post.entity';

export const POST_FIND_OPTIONS: FindManyOptions<PostsModel> = {
  select: {
    id: true,
    title: true,
    content: true,
    content_slate: true,
    createdAt: true,
  },
  relations: {
    author: true,
  },
};
