import { IsNumber, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { UsersModel } from 'src/modules/users/entity/users.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('categories')
export class CategoryModel extends BaseModel {
  @Column()
  @IsNumber()
  pos: number;

  @ManyToOne(() => UsersModel, (user) => user.posts, {
    nullable: false,
  })
  @JoinColumn({
    name: 'users_id',
  })
  user: UsersModel;

  @Column({
    length: 150,
    nullable: false,
    name: 'cateogory_name',
  })
  @IsString()
  categoryName: string;
}
