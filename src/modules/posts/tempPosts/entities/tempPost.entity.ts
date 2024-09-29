import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { UsersModel } from 'src/modules/users/entity/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { PostsModel } from '../../entities/post.entity';

@Entity('temp_posts')
export class TempPostsModel extends BaseModel {
  @ManyToOne(() => UsersModel, (user) => user.posts, {
    nullable: false,
  })
  @JoinColumn({ name: 'users_id' })
  author: UsersModel;

  @Column({
    name: 'users_id',
    nullable: false,
  })
  @IsNumber()
  authorId: number;

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
  @IsString()
  contentSlate: string = '';

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @JoinColumn({ name: 'post_id' })
  @OneToOne(() => PostsModel, (post) => post.tempPost)
  post: PostsModel;

  @Column({
    name: 'post_id',
    nullable: false,
  })
  @IsNumber()
  postId: number;
}
