import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { LogInterceptor } from './common/interceptor/log.interceptor';
@Module({
  imports: [CommonModule, AuthModule, PostsModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    },
  ],
})
export class AppModule {}
