import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { UsersModel } from 'src/modules/users/entity/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

@Entity('temp_posts')
export class TempPostsModel extends BaseModel {
  @ManyToOne(() => UsersModel, (user) => user.posts, {
    nullable: false,
  })
  @JoinColumn({ name: 'users_id' })
  author: UsersModel;

  @IsOptional()
  @Column({
    length: 300,
    nullable: false,
  })
  @IsString()
  title: string = '';

  @IsOptional()
  @Column({
    length: 6000,
    nullable: false,
  })
  @IsString()
  content: string = '';

  @Column({
    length: 6000,
    name: 'content_slate',
  })
  @IsString()
  contentSlate: string = '';

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
