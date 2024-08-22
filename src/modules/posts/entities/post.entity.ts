import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { UsersModel } from 'src/modules/users/entity/users.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PostFilesModel } from '../files/entities/files.entity';

@Entity('posts')
export class PostsModel extends BaseModel {
  @ManyToOne(() => UsersModel, (user) => user.posts, {
    nullable: false,
  })
  @JoinColumn({ name: 'users_id' })
  author: UsersModel;

  @Column({
    length: 300,
    nullable: false,
  })
  @IsString()
  title: string;

  @Column({
    length: 6000,
    nullable: false,
  })
  @IsString()
  content: string;

  @Column({
    length: 6000,
    name: 'content_slate',
  })
  @IsString()
  contentSlate: string;

  // RelationShip
  @OneToMany((type) => PostFilesModel, (postFile) => postFile.post)
  postFiles: PostFilesModel[];
}
