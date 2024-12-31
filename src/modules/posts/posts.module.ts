import { Module, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './entities/post.entity';
import { CommonModule } from 'src/common/common.module';
import { ImagesModule } from './images/images.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from '../auth/guard/bearer-token.guard';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { CategoriesModule } from '../categories/categories.module';
import { PostFilesModule } from './files/postFiles.module';
import { TempPostsModel } from './tempPosts/entities/tempPost.entity';
import { TempPostsModule } from './tempPosts/tempPosts.module';
import { CommentsModule } from './comments/comments.module';
import { CommentsModel } from './comments/entities/comments.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostsModel, TempPostsModel, CommentsModel]),
    CommonModule,
    ImagesModule,
    PostFilesModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    TempPostsModule,
    CommentsModule,
  ],
  exports: [PostsService],
  controllers: [PostsController],
  providers: [
    PostsService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class PostsModule {}
