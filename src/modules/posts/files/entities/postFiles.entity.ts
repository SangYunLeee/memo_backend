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

@Entity('post_files')
@Exclude({ toPlainOnly: true })
export class PostFilesModel {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PostsModel)
  @JoinColumn({ name: 'post_id' })
  post: PostsModel;

  @Column({ type: 'int', name: 'post_id' })
  postId: number;

  @Expose()
  @Column({ type: 'varchar', length: 255, name: 'original_filename' })
  originalFilename: string;

  @Column({ type: 'varchar', length: 255, name: 'stored_filename' })
  storedFilename: string;

  @Expose()
  @Column({ type: 'bigint', name: 'file_size' })
  fileSize: number;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'mime_type' })
  mimeType: string;

  @Expose()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 1000, name: 'file_path' })
  filePath: string;

  @Expose()
  get url(): string {
    console.log(this.post);
    return `${process.env.BACKEND_URL}/posts/${this.postId}/files/file/${this.storedFilename}`;
  }

  constructor(partial: Partial<PostFilesModel>) {
    Object.assign(this, partial);
  }
}
