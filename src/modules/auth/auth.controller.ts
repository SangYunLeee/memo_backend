import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersModel } from 'src/modules/users/entity/users.entity';
import { RefreshTokenGuard } from './guard/bearer-token.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from '../users/decorator/user.decorator';
import { Response } from 'express';
import { ApiEndpoint } from 'src/common/decorator/api-docs.decorator';
import { AuthApiSpec } from './auth.api-spec';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(RefreshTokenGuard)
  @ApiEndpoint(AuthApiSpec.tokenAccess)
  postTokenAccess(@Req() req: { token: string }) {
    const newToken = this.authService.rotateToken(req.token, false);
    return {
      accessToken: newToken,
    };
  }

  @UseGuards(RefreshTokenGuard)
  @ApiEndpoint(AuthApiSpec.tokenRefresh)
  postTokenRefresh(@Req() req: { token: string }) {
    const newToken = this.authService.rotateToken(req.token, true);
    return {
      refreshToken: newToken,
    };
  }

  @HttpCode(HttpStatus.OK)
  @ApiEndpoint(AuthApiSpec.loginWithEmail)
  async loginWithEmail(
    @Body() user: Pick<UsersModel, 'email' | 'password'>,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.loginWithEmail(user);

    // Access Token 쿠키 설정
    response.cookie('access_token', result.token.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });
    return result;
  }

  @ApiEndpoint(AuthApiSpec.registerWithEmail)
  async registerWithEmail(
    @Body() user: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.registerWithEmail(user);

    // Access Token 쿠키 설정
    response.cookie('access_token', result.token.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });
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
