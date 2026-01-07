import { Nickname, Email, Password } from 'src/common/decorator/entity-field.decorator';

export class RegisterUserDto {
  @Nickname()
  nickname: string;

  @Email()
  email: string;

  @Password()
  password: string;
}
