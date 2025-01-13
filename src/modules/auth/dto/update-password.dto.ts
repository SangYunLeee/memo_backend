import { IsString, Length } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @Length(3, 20)
  currentPassword: string;

  @IsString()
  @Length(3, 20)
  newPassword: string;
}
