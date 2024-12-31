import { IsNumber, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { UsersModel } from 'src/modules/users/entity/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { PostsModel } from '../../entities/post.entity';
import { Exclude } from 'class-transformer';

@Entity('comments')
export class CommentsModel extends BaseModel {
  @ManyToOne(() => UsersModel, (user) => user.comments, {
    nullable: false,
  })
  @JoinColumn({ name: 'users_id' })
  user: UsersModel;

  @ManyToOne(() => PostsModel, (post) => post.comments, {
    nullable: false,
  })
  @JoinColumn({ name: 'posts_id' })
  post: PostsModel;

  @Column({
    length: 1000,
    nullable: false,
  })
  @IsString()
  content: string;

  @Exclude()
  @Column({
    name: 'users_id',
  })
  @IsNumber()
  usersId: number;

  @Column({
    name: 'posts_id',
  })
  @IsNumber()
  postsId: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
