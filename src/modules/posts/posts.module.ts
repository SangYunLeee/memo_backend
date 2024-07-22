import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
