import { Column, Entity, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { BaseModel } from 'src/common/entity/base.entity';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { PostsModel } from 'src/modules/posts/entities/post.entity';
import { PostImagesModel } from 'src/modules/posts/images/entities/postImages.entity';
import { UserImagesModel } from '../images/entity/usersImages.entity';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { CommentsModel } from 'src/modules/posts/comments/entities/comments.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class UsersModel extends BaseModel {
  @ApiProperty({
    description: '사용자 닉네임',
    example: 'johndoe',
    minLength: 3,
    maxLength: 20,
  })
  @Column({
    unique: true,
    length: 20,
  })
  @IsString()
  @Length(3, 20)
  nickname: string;

  @ApiProperty({
    description: '이메일 주소',
    example: 'user@example.com',
    format: 'email',
  })
  @Column({
    unique: true,
    length: 100,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '비밀번호',
    example: 'password123',
    minLength: 3,
    maxLength: 20,
  })
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
