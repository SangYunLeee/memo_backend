import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdatePasswordDtoSpec } from './update-password.dto-spec';

export class UpdatePasswordDto {
  @ApiProperty(UpdatePasswordDtoSpec.currentPassword)
  @IsString()
  @Length(3, 20)
  currentPassword: string;

  @ApiProperty(UpdatePasswordDtoSpec.newPassword)
  @IsString()
  @Length(3, 20)
  newPassword: string;
}
