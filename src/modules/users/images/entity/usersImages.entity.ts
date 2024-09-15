import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { UsersModel } from '../../entity/users.entity';

@Entity('user_files')
export class UserImagesModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersModel)
  @JoinColumn({ name: 'user_id' })
  user: UsersModel;

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

  @Column({ type: 'boolean', name: 'is_profile_image' })
  is_profile_image: boolean;

  @Column({ type: 'boolean', name: 'pending_deletion' })
  pendingDeletion: boolean;
}
