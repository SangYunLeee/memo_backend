import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostFilesModel } from './entities/postFiles.entity';
import { Repository } from 'typeorm';
import { PostsService } from '../posts.service';
import fs, { promises, mkdirSync, existsSync } from 'fs';
import { generateHashedPath } from '../../../common/utils/upload/multer-options';
@Injectable()
export class PostFilesService {
  constructor(
    @InjectRepository(PostFilesModel)
    private readonly postFilesRepository: Repository<PostFilesModel>,
    private readonly postsService: PostsService,
  ) {}

  async getFile(filename: string) {
    const filePath = generateHashedPath(filename, 'postFile');
    if (!existsSync(`${filePath}/${filename}`)) {
      console.log('files not found');
      throw new NotFoundException('File not found');
    }
    return `${filePath}/${filename}`;
  }

  async deleteFile(fileId: number) {
    const file = await this.postFilesRepository.findOne({
      where: { id: fileId },
    });
    if (!file) {
      throw new NotFoundException('File not found');
    }
    await this.postFilesRepository.delete({ id: fileId });
    // TODO: 파일 삭제
    // 추후 데몬 프로세스로 처리
  }

  async createPostFile(postId: number, file: Express.Multer.File) {
    const post = await this.postsService.getPostById(postId);
    if (!post) {
      throw new Error('Post not found');
    }
    // postfiles에 들어갈 이미지 경로 변수 수정
    const filePath = generateHashedPath(file.filename, 'postFile');
    const postFile = await this.postFilesRepository.save({
      post: { id: postId },
      originalFilename: file.originalname,
      storedFilename: file.filename,
      fileSize: file.size,
      mimeType: file.mimetype,
      filePath: filePath,
    });
    mkdirSync(filePath, { recursive: true });
    await promises.rename(
      `${file.destination}/${file.filename}`,
      `${filePath}/${file.filename}`,
    );
    return new PostFilesModel(postFile);
  }
}
