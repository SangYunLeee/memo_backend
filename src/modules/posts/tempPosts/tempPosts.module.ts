import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TempPostsService } from './tempPosts.service';
import { TempPostsModel } from './entities/tempPost.entity';
import { PostsModel } from '../entities/post.entity';
import { TempPostsController } from './tempPost.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TempPostsModel, PostsModel])],
  controllers: [TempPostsController],
  providers: [TempPostsService],
  exports: [TempPostsService],
})
export class TempPostsModule {}
