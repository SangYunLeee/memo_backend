import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostImagesModel } from './entities/postImages.entity';
import { Repository } from 'typeorm';
import { PostsService } from '../posts.service';
import fs, { promises, mkdirSync, existsSync } from 'fs';
import { generateHashedPath } from './const/multer-options';
@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(PostImagesModel)
    private readonly imagesRepository: Repository<PostImagesModel>,
    private readonly postsService: PostsService,
  ) {}

  async getImageFile(filename: string) {
    const filePath = generateHashedPath(filename);
    if (!existsSync(`${filePath}/${filename}`)) {
      console.log('Image not found');
      throw new NotFoundException('Image not found');
    }
    return `${filePath}/${filename}`;
  }

  async createPostImage(
    postId: number,
    isThumbnail: boolean,
    image: Express.Multer.File,
  ) {
    const post = await this.postsService.getPostById(postId);
    if (!post) {
      throw new Error('Post not found');
    }
    // postImages에 들어갈 이미지 경로 변수 수정
    const imagePath = generateHashedPath(image.filename);
    const postImage = await this.imagesRepository.save({
      post: { id: postId },
      isThumbnail,
      originalFilename: image.originalname,
      storedFilename: image.filename,
      fileSize: image.size,
      mimeType: image.mimetype,
      filePath: imagePath,
    });
    mkdirSync(imagePath, { recursive: true });
    await promises.rename(
      `${image.destination}/${image.filename}`,
      `${imagePath}/${image.filename}`,
    );
    return {
      postImage: {
        id: postImage.id,
        url: `${process.env.BASE_URL}/posts/${post.id}/images/file/${image.filename}`,
      },
    };
  }
}
