import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/modules/users/users.module';
import { OAuthController } from './oauth/oauth.controller';
import { GoogleOAuthService } from './oauth/oauth-google.service';

@Module({
  imports: [JwtModule.register({}), UsersModule],
  exports: [AuthService],
  controllers: [AuthController, OAuthController],
  providers: [AuthService, GoogleOAuthService],
})
export class AuthModule {}
