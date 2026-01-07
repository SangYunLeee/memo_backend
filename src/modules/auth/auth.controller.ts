import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  Patch,
  Res,
  Get,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersModel } from 'src/modules/users/entity/users.entity';
import { RefreshTokenGuard } from './guard/bearer-token.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from '../users/decorator/user.decorator';
import { Response } from 'express';
import { ApiEndpoint } from 'src/common/decorator/api-docs.decorator';
import { AuthApiSpec } from './auth.api-spec';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  postTokenAccess(@Req() req: { token: string }) {
    const newToken = this.authService.rotateToken(req.token, false);
    /**
     * {accessToken: {token}}
     */
    return {
      accessToken: newToken,
    };
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(@Req() req: { token: string }) {
    const newToken = this.authService.rotateToken(req.token, true);
    /**
     * {refreshToken: {token}}
     */
    return {
      refreshToken: newToken,
    };
  }

  @Post('login/email')
  @IsPublic()
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

  @Post('register/email')
  @IsPublic()
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

  @Patch('password')
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

  @IsPublic()
  @Get('logout')
  @ApiEndpoint(AuthApiSpec.logout)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }
}
