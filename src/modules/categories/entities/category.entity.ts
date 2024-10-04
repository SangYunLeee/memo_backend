import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { PostsModel } from 'src/modules/posts/entities/post.entity';
import { UsersModel } from 'src/modules/users/entity/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('categories')
export class CategoryModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNumber()
  @IsOptional()
  pos: number = 99;

  @ManyToOne(() => UsersModel, (user) => user.posts, {
    nullable: false,
  })
  @JoinColumn({
    name: 'users_id',
  })
  user: UsersModel;

  @Column({
    length: 150,
    nullable: false,
    name: 'category_name',
  })
  @IsString()
  categoryName: string;

  @Column({
    default: 0,
    name: 'post_count',
  })
  @IsNumber()
  postCount: number;

  @OneToMany(() => PostsModel, (post) => post.category)
  posts: PostsModel[];
}
