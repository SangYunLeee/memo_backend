import { UsersModel } from './users/entity/users.entity';
import { PostsModel } from './posts/entities/post.entity';
import { PostImagesModel } from './posts/images/entities/postImages.entity';
import { PostStatusModel } from './posts/entities/post-status.entity';
import { CategoryModel } from './categories/entities/category.entity';
import { UserImagesModel } from './users/images/entity/usersImages.entity';
import { PostFilesModel } from './posts/files/entities/postFiles.entity';
export const entities = [
  UsersModel,
  PostsModel,
  PostImagesModel,
  PostStatusModel,
  CategoryModel,
  UserImagesModel,
  PostFilesModel,
];
