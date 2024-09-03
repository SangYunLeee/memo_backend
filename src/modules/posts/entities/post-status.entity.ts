import { IsNumber, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { UsersModel } from 'src/modules/users/entity/users.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostsModel } from './post.entity';

@Entity('post_statuses')
export class PostStatusModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 20,
    nullable: false,
    unique: true,
    name: 'status_name',
  })
  @IsString()
  statusName: string;

  @OneToMany(() => PostsModel, (post) => post.status)
  posts: PostsModel[];
}
