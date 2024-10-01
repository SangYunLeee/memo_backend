import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TempPostsModel } from './entities/tempPost.entity';
import { PostsModel } from '../entities/post.entity';
import { UpdateTempPostDto } from './dto/update-tempPost.dto';
import { assignAndTransform } from 'src/common/utils/object-formatter';

@Injectable()
export class TempPostsService {
  constructor(
    @InjectRepository(TempPostsModel)
    private tempPostsRepository: Repository<TempPostsModel>,
    @InjectRepository(PostsModel)
    private postsRepository: Repository<PostsModel>,
  ) {}

  async getTempPostByPostId(userId: number, postId: number) {
    const result = await this.tempPostsRepository.findOne({
      where: { postId, authorId: userId },
    });
    if (!result) {
      throw new NotFoundException('게시글이 없거나 사용자가 권한이 없습니다.');
    }
    return result;
  }

  async updateTempPost(
    userId: number,
    postId: number,
    updateTempPostDto: UpdateTempPostDto,
  ): Promise<TempPostsModel> {
    const post = await this.postsRepository.findOne({
      where: { id: postId, authorId: userId },
    });
    if (!post) {
      throw new NotFoundException('게시글이 없거나 사용자가 권한이 없습니다.');
    }

    const tempPost = await this.tempPostsRepository.findOne({
      where: { postId, authorId: userId },
    });

    const savedTempPost = await this.tempPostsRepository.save({
      ...updateTempPostDto,
      id: tempPost?.id,
      authorId: userId,
      postId: postId,
    });
    const postImage = assignAndTransform(TempPostsModel, savedTempPost);
    return postImage;
  }

  async deleteTempPost(userId: number, postId: number): Promise<void> {
    const result = await this.tempPostsRepository.delete({
      postId,
      authorId: userId,
    });
    if (result.affected === 0) {
      throw new NotFoundException('게시글이 없거나 사용자가 권한이 없습니다.');
    }
  }
}
