import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/modules/users/users.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorator/is-public.decorator';

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  getTokenType() {
    return 'none';
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const req = context.switchToHttp().getRequest();
    const rawToken = req.headers['authorization'];
    const cookieToken = req.cookies?.['access_token'];
    const tokenIsExist = rawToken || cookieToken;
    if (tokenIsExist) {
      try {
        const token = rawToken
          ? this.authService.extractTokenFromHeader(rawToken, true)
          : cookieToken;
        const result = await this.authService.verifyToken(token);
        const user = await this.usersService.getUserByEmail(result.email);

        req.user = user;
        req.token = token;
        req.tokenType = result.type;

        if (!isPublic && req.tokenType !== this.getTokenType()) {
          throw new UnauthorizedException(
            `${this.getTokenType()} Token이 아닙니다.`,
          );
        }
      } catch (error) {
        if (!isPublic) {
          throw new UnauthorizedException('유효하지 않은 토큰입니다.');
        }
      }
    } else if (!isPublic) {
      throw new UnauthorizedException('토큰이 없습니다!');
    }

    return true;
  }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
  getTokenType() {
    return 'access';
  }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
  getTokenType() {
    return 'refresh';
  }
}
