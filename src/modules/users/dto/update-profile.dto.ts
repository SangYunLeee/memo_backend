import { PickType } from '@nestjs/mapped-types';
import { IsOptional, IsNumber, IsString, Length } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { UsersModel } from '../entity/users.entity';

export class UpdateProfileDto extends PickType(UsersModel, [
  'nickname',
  'profileDescription',
]) {
  @IsOptional()
  @IsString()
  @Length(3, 20)
  nickname: string;

  @IsOptional()
  @IsString()
  profileDescription: string;
}
