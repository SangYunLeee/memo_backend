import { Column, Entity, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { BaseModel } from 'src/common/entity/base.entity';
import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { PostsModel } from 'src/modules/posts/entities/post.entity';
import { PostImagesModel } from 'src/modules/posts/images/entities/postImages.entity';
import { UserImagesModel } from '../images/entity/usersImages.entity';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { CommentsModel } from 'src/modules/posts/comments/entities/comments.entity';
import { Nickname, Email, Password } from 'src/common/decorator/entity-field.decorator';

@Entity('users')
export class UsersModel extends BaseModel {
  @Nickname()
  nickname: string;

  @Email()
  email: string;

  @Password()
  password: string;

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @IsString()
  @Column({ nullable: true, name: 'profile_description' })
  profileDescription: string;

  // RelationShip
  @OneToMany((type) => PostsModel, (post) => post.author)
  posts: PostsModel[];

  @OneToMany(() => UserImagesModel, (image) => image.user)
  images?: UserImagesModel[];

  @Expose()
  @OneToOne(() => UserImagesModel, (image) => image.user)
  profileImage?: UserImagesModel;

  @OneToMany(() => CommentsModel, (comment) => comment.user)
  comments: CommentsModel[];

  updateProfileInfo(updateDto: UpdateProfileDto) {
    if (updateDto.nickname) {
      this.nickname = updateDto.nickname;
    }
    if (updateDto.profileDescription) {
      this.profileDescription = updateDto.profileDescription;
    }
    return this;
  }
}
