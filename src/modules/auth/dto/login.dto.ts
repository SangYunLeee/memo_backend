import { Email, Password } from 'src/common/decorator/entity-field.decorator';

export class LoginDto {
  @Email()
  email: string;

  @Password()
  password: string;
}
