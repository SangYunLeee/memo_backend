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
};
