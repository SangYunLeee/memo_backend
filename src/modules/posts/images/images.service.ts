import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostImagesModel } from './entities/postImages.entity';
import { Repository } from 'typeorm';
import { promises, mkdirSync, existsSync } from 'fs';
import { generateHashedPath } from '../../../common/utils/upload/multer-options';
import { assignAndTransform } from 'src/common/utils/object-formatter';
@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(PostImagesModel)
    private readonly imagesRepository: Repository<PostImagesModel>,
  ) {}

  async getImageFile(filename: string) {
    const filePath = generateHashedPath(filename, 'postImage');
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
    // postImages에 들어갈 이미지 경로 변수 수정
    const imagePath = generateHashedPath(image.filename, 'postImage');
    const fetchedPostImage = await this.imagesRepository.save({
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
    const postImage = assignAndTransform(PostImagesModel, fetchedPostImage);
    return postImage;
  }
}
