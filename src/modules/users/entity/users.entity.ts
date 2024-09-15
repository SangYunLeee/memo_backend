import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { BaseModel } from 'src/common/entity/base.entity';
import { IsEmail, IsString, Length } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { PostsModel } from 'src/modules/posts/entities/post.entity';
import { PostImagesModel } from 'src/modules/posts/images/entities/postImages.entity';
import { UserImagesModel } from '../images/entity/usersImages.entity';

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

  @Column({ nullable: true, name: 'profile_description' })
  profileDescription: string;

  // RelationShip
  @OneToMany((type) => PostsModel, (post) => post.author)
  posts: PostsModel[];

  @OneToMany(() => UserImagesModel, (image) => image.user)
  images?: UserImagesModel[];

  @Expose()
  profileImage?: UserImagesModel;
}
