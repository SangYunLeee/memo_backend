import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModel } from 'src/modules/users/entity/users.entity';
import { RefreshTokenGuard } from './guard/bearer-token.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from '../users/decorator/user.decorator';

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
  loginWithEmail(@Body() user: Pick<UsersModel, 'email' | 'password'>) {
    return this.authService.loginWithEmail(user);
  }

  @Post('register/email')
  @IsPublic()
  registerWithEmail(@Body() user: RegisterUserDto) {
    return this.authService.registerWithEmail(user);
  }

  @Patch('password')
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
}
