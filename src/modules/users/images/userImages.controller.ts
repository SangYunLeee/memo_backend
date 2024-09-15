import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService } from './userImages.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from 'src/modules/auth/guard/bearer-token.guard';
import { Response } from 'express';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { User } from '../decorator/user.decorator';

@Controller('users')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get(':userId/profile/images/file/:filename')
  @IsPublic()
  async getImageFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const filePath = await this.imagesService.getImageFile(filename);
    return res.sendFile(filePath);
  }

  @Put('me/profile/images')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @User('id') userId: number,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return await this.imagesService.updateProfileImage(+userId, image);
  }
}
