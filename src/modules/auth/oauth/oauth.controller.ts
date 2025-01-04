import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { GoogleOAuthService } from './oauth-google.service';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { UsersService } from 'src/modules/users/users.service';
import { AuthService } from '../auth.service';
import { randomUUID } from 'crypto';

@Controller('auth/oauth')
export class OAuthController {
  constructor(
    private readonly googleService: GoogleOAuthService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post(':provider/login')
  @IsPublic()
  async oauthLogin(
    @Param('provider') provider: string,
    @Body() body: { accessToken: string },
  ) {
    switch (provider) {
      case 'google':
        const { email } = await this.googleService.verifyToken(
          body.accessToken,
        );
        if (!email) {
          throw new BadRequestException('Invalid token');
        }
        try {
          const existingUser = await this.usersService.getUserByEmail(email);
          // 이미 가입된 유저인 경우
          const token = this.authService.loginToken(existingUser);
          return { user: existingUser, token };
        } catch (e) {
          // 가입되지 않은 유저인 경우
          // 자동 회원가입 후 로그인
          const password = randomUUID();
          return this.authService.registerWithEmail({
            email,
            nickname: email.split('@')[0],
            password,
          });
        }
      default:
        throw new BadRequestException('Unsupported OAuth provider');
    }
  }
}
