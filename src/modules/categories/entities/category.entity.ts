import { Transform } from 'class-transformer';
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
  @Transform(
    ({ value }) => {
      return value.trim();
    },
    { toClassOnly: true },
  )
  @IsString()
  categoryName: string;

  @Column({
    default: 0,
    name: 'post_count',
  })
  @IsNumber()
  postCount: number;

  @Column({
    default: 0,
    name: 'temp_post_count',
  })
  @IsNumber()
  tempPostCount: number;

  @Column({ name: 'parent_cate_id', nullable: true })
  parentId: number;

  @ManyToOne(() => CategoryModel, category => category.children)
  @JoinColumn({ name: 'parent_cate_id' })
  parent: CategoryModel;

  @OneToMany(() => CategoryModel, category => category.parent)
  children: CategoryModel[];

  @Column({
    default: 0,
  })
  @IsNumber()
  depth: number;

  @OneToMany(() => PostsModel, (post) => post.category)
  posts: PostsModel[];
}
