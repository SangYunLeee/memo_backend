import { IsString } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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
