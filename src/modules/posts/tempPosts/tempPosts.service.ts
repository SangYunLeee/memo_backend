import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TempPostsModel } from './entities/tempPost.entity';
import { PostsModel } from '../entities/post.entity';
import { CreateTempPostDto } from './dto/create-tempPost.dto';
import { UpdateTempPostDto } from './dto/update-tempPost.dto';

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

    let tempPost = await this.tempPostsRepository.findOne({
      where: { postId, authorId: userId },
    });

    if (!tempPost) {
      // 임시 게시글이 없으면 새로 생성
      tempPost = this.tempPostsRepository.create({
        authorId: userId,
        postId: postId,
      });
    }

    // Object.assign()을 사용하여 모든 필드 업데이트
    Object.assign(tempPost, updateTempPostDto);

    return this.tempPostsRepository.save(tempPost);
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
