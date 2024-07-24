import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModel } from 'src/modules/users/entity/users.entity';
import { RefreshTokenGuard } from './guard/bearer-token.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  @IsPublic()
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
  @IsPublic()
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
  async loginWithEmail(
    @Body() user: Pick<UsersModel, 'email' | 'password'>,
    @Res() response: Response,
  ) {
    const token = await this.authService.loginWithEmail(user);
    response.cookie('accessToken', token.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    return response.json({ message: '로그인 성공', ...token });
  }

  @Post('register/email')
  @IsPublic()
  async registerWithEmail(
    @Body() user: RegisterUserDto,
    @Res() response: Response,
  ) {
    const token = await this.authService.registerWithEmail(user);
    response.cookie('accessToken', token.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    return response.json({ message: '회원가입 성공', ...token });
  }
}
