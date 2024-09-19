import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { UsersModel } from '../../entity/users.entity';
import { Exclude, Expose } from 'class-transformer';
import { PostsModel } from 'src/modules/posts/entities/post.entity';

@Entity('user_files')
export class UserImagesModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersModel)
  @JoinColumn({ name: 'user_id' })
  user: UsersModel;

  @Column({ type: 'int', name: 'user_id' })
  userId: number;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'original_filename',
    select: false,
  })
  originalFilename: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'stored_filename',
  })
  storedFilename: string;

  @Column({ type: 'bigint', name: 'file_size', select: false })
  fileSize: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'mime_type',
    select: false,
  })
  mimeType: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 1000, name: 'file_path', select: false })
  filePath: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'boolean', name: 'is_profile_image' })
  is_profile_image: boolean;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'boolean', name: 'pending_deletion' })
  pendingDeletion: boolean;

  @Expose()
  get url(): string {
    return `${process.env.BACKEND_URL}/users/${this.userId}/profile/images/file/${this.storedFilename}`;
  }

  @OneToMany(() => PostsModel, (post) => post.userImage)
  posts: PostsModel[];
}
