import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { PostsModel } from '../../entities/post.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity('post_images')
@Exclude({ toPlainOnly: true })
export class PostImagesModel {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PostsModel)
  @JoinColumn({ name: 'post_id' })
  post: PostsModel;

  @Column({ type: 'int', name: 'post_id' })
  postId: number;

  @Column({ type: 'boolean', default: false, name: 'is_thumbnail' })
  isThumbnail: boolean;

  @Column({ type: 'varchar', length: 255, name: 'original_filename' })
  originalFilename: string;

  @Column({ type: 'varchar', length: 255, name: 'stored_filename' })
  storedFilename: string;

  @Column({ type: 'bigint', name: 'file_size' })
  fileSize: number;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'mime_type' })
  mimeType: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 1000, name: 'file_path' })
  filePath: string;

  @Expose()
  get url(): string {
    return `${process.env.BACKEND_URL}/posts/${this.postId}/files/file/${this.storedFilename}`;
  }
}
