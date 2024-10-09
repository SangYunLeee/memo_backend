import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { UsersModel } from 'src/modules/users/entity/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { PostStatusModel } from './post-status.entity';
import { PostImagesModel } from '../images/entities/postImages.entity';
import { CategoryModel } from 'src/modules/categories/entities/category.entity';
import { UserImagesModel } from 'src/modules/users/images/entity/usersImages.entity';
import { PostFilesModel } from '../files/entities/postFiles.entity';
import { Exclude, Transform } from 'class-transformer';
import { TempPostsModel } from '../tempPosts/entities/tempPost.entity';

export enum PostVisibility {
  PUBLIC = 1,
  PRIVATE = 2,
}

export enum PostStatus {
  DRAFT = 1,
  PUBLISHED = 2,
  UNREGISTERED = 3,
}

@Entity('posts')
export class PostsModel extends BaseModel {
  @ManyToOne(() => UsersModel, (user) => user.posts, {
    nullable: false,
  })
  @JoinColumn({ name: 'users_id' })
  author: UsersModel;

  @IsOptional()
  @Column({
    length: 300,
    nullable: false,
  })
  @IsString()
  title: string = '';

  @IsOptional()
  @Column({
    length: 6000,
    nullable: false,
  })
  @IsString()
  content: string = '';

  @Column({
    length: 6000,
    name: 'content_slate',
  })
  @Transform(
    ({ value }) => {
      try {
        return JSON.parse(value);
      } catch (error) {
        console.error('contentSlate 파싱 실패:', error);
        return value;
      }
    },
    { toPlainOnly: true },
  )
  @IsString()
  contentSlate: string = '';

  // 1: public, 2: private
  @Column({
    name: 'visibility_id',
    default: PostVisibility.PUBLIC,
  })
  @IsNumber()
  visibilityId: number;

  @Column({
    name: 'cate_id',
  })
  @IsNumber()
  categoryId: number;

  @Column({
    name: 'status_id',
  })
  @IsNumber()
  statusId: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Exclude()
  @Column({
    name: 'users_id',
  })
  @IsNumber()
  authorId: number;

  // RelationShip
  @OneToMany((type) => PostImagesModel, (postImage) => postImage.post)
  postImages: PostImagesModel[];

  // 1: draft, 2: published, 3: unregistered
  @ManyToOne((type) => PostStatusModel, (status) => status.posts)
  @JoinColumn({ name: 'status_id' })
  status: PostStatusModel;

  @ManyToOne((category) => CategoryModel, (category) => category.posts)
  @JoinColumn({ name: 'cate_id' })
  category: CategoryModel;

  @ManyToOne(() => UserImagesModel, (userImage) => userImage.posts)
  @JoinColumn({ name: 'users_id' })
  userImage: UserImagesModel;

  // RelationShip
  @OneToMany((type) => PostFilesModel, (postFile) => postFile.post)
  postFiles: PostFilesModel[];

  @OneToOne(() => TempPostsModel, (tempPost) => tempPost.post)
  tempPost: TempPostsModel;
}
