import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsModel } from './entities/comments.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsModel)
    private readonly commentsRepository: Repository<CommentsModel>,
  ) {}

  async createComment(
    postId: number,
    createCommentDto: CreateCommentDto,
    userId: number,
  ) {
    const comment = this.commentsRepository.create({
      ...createCommentDto,
      postsId: postId,
      usersId: userId,
    });
    return await this.commentsRepository.save(comment);
  }

  async deleteComment(id: number) {
    const comment = await this.commentsRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    await this.commentsRepository.delete(id);

    return {
      success: true,
      message: '댓글이 성공적으로 삭제되었습니다.',
      deletedCommentId: id,
    };
  }

  async updateComment(id: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentsRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    await this.commentsRepository.update(id, updateCommentDto);

    const updatedComment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    return updatedComment;
  }
}
