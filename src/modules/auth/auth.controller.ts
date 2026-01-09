import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersModel } from 'src/modules/users/entity/users.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/decorator/user.decorator';
import { Response } from 'express';
import { ApiEndpoint } from 'src/common/decorator/api-docs.decorator';
import { AuthApiSpec } from './auth.api-spec';
import { setAccessTokenCookie } from './utils/cookie.helper';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiEndpoint(AuthApiSpec.loginWithEmail)
  async loginWithEmail(
    @Body() user: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.loginWithEmail(user);

    setAccessTokenCookie(response, result.token.accessToken);
    return result;
  }

  @ApiEndpoint(AuthApiSpec.registerWithEmail)
  async registerWithEmail(
    @Body() user: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.registerWithEmail(user);

    setAccessTokenCookie(response, result.token.accessToken);
    return result;
  }

  @ApiEndpoint(AuthApiSpec.updatePassword)
  async updatePassword(
    @Body() body: UpdatePasswordDto,
    @User() user: Pick<UsersModel, 'email' | 'id'>,
  ) {
    await this.authService.authenticateUserWithEmail({
      email: user.email,
      password: body.currentPassword,
    });
    return this.authService.updatePassword(user.id, body.newPassword);
  }

  @ApiEndpoint(AuthApiSpec.logout)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }
}
