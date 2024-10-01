import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TempPostsService } from './tempPosts.service';
import { TempPostsModel } from './entities/tempPost.entity';
import { PostsModel } from '../entities/post.entity';
import { TempPostsController } from './tempPost.controller';
import { PostsModule } from '../posts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TempPostsModel, PostsModel]),
    forwardRef(() => PostsModule),
  ],
  controllers: [TempPostsController],
  providers: [TempPostsService],
  exports: [TempPostsService],
})
export class TempPostsModule {}
