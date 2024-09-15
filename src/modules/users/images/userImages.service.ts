import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import fs, { promises, mkdirSync, existsSync } from 'fs';
import { UserImagesModel } from './entity/usersImages.entity';
import { generateHashedPath } from 'src/common/utils/upload/multer-options';
@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(UserImagesModel)
    private readonly imagesRepository: Repository<UserImagesModel>,
  ) {}

  async getImageFile(filename: string) {
    const filePath = generateHashedPath(filename, 'profile');
    if (!existsSync(`${filePath}/${filename}`)) {
      console.log('Image not found');
      throw new NotFoundException('Image not found');
    }
    return `${filePath}/${filename}`;
  }

  async updateProfileImage(userId: number, image: Express.Multer.File) {
    // postImages에 기존에 있던 이미지 DB 변경
    const profileImages = await this.imagesRepository.find({
      where: { user: { id: userId }, is_profile_image: true },
    });
    for (const img of profileImages) {
      img.is_profile_image = false;
      img.pendingDeletion = true;
      await this.imagesRepository.save(img);
    }

    // TODO
    // 이미지 파일 삭제 로직 별도 추가 (비동기 데몬으로 처리 고려)

    // postImages에 들어갈 이미지 경로 변수 수정
    const imagePath = generateHashedPath(image.filename, 'profile');
    const profileImage = await this.imagesRepository.save({
      user: { id: userId },
      originalFilename: image.originalname,
      storedFilename: image.filename,
      fileSize: image.size,
      mimeType: image.mimetype,
      filePath: imagePath,
      is_profile_image: true,
    });
    mkdirSync(imagePath, { recursive: true });
    await promises.rename(
      `${image.destination}/${image.filename}`,
      `${imagePath}/${image.filename}`,
    );
    return {
      profileImage: {
        id: profileImage.id,
        url: `${process.env.BACKEND_URL}/users/${userId}/profile/images/file/${image.filename}`,
      },
    };
  }
}
