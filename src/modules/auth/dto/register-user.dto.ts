import { PickType } from '@nestjs/swagger';
import { UsersModel } from 'src/modules/users/entity/users.entity';

export class RegisterUserDto extends PickType(UsersModel, [
  'nickname',
  'email',
  'password',
]) {}
