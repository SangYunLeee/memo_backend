import { IsNumber, IsString, IsOptional, IsBoolean } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { UsersModel } from 'src/modules/users/entity/users.entity';
import { PostsModel } from 'src/modules/posts/entities/post.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('post_files')
export class PostFilesModel extends BaseModel {
  @ManyToOne(() => UsersModel, (user) => user.postFiles, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  author: UsersModel;

  @ManyToOne(() => PostsModel, (post) => post.postFiles, {
    nullable: false,
  })
  @JoinColumn({ name: 'post_id' })
  post: PostsModel;

  @Column({
    length: 255,
    nullable: false,
    name: 'original_filename',
  })
  @IsString()
  originalFilename: string;

  @Column({
    length: 255,
    nullable: false,
    name: 'stored_filename',
  })
  @IsString()
  storedFilename: string;

  @Column({
    name: 'file_size',
    nullable: false,
  })
  @IsNumber()
  fileSize: number;

  @Column({
    length: 100,
    nullable: true,
    name: 'mime_type',
  })
  @IsOptional()
  @IsString()
  mimeType: string;

  @Column({
    length: 1000,
    nullable: false,
    name: 'file_path',
  })
  @IsString()
  filePath: string;

  @Column({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description: string;

  @Column({
    name: 'is_temporary',
    type: 'boolean',
    nullable: false,
    default: true,
  })
  @IsBoolean()
  isTemporary: boolean;
}
