import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { BaseModel } from 'src/common/entity/base.entity';
import { IsEmail, IsString, Length } from 'class-validator';
import { Exclude } from 'class-transformer';
import { PostsModel } from 'src/modules/posts/entities/post.entity';

@Entity('users')
export class UsersModel extends BaseModel {
  @Column({
    unique: true,
    length: 20,
  })
  @IsString()
  @Length(3, 20)
  nickname: string;

  @Column({
    unique: true,
    length: 100,
  })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  @Length(3, 20)
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  // RelationShip
  @OneToMany((type) => PostsModel, (post) => post.author)
  posts: PostsModel[];
}