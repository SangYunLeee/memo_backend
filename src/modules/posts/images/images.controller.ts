import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from 'src/modules/auth/guard/bearer-token.guard';
import { Response } from 'express';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { IsPostMineOrAdminGuard } from '../guard/is-post-mine-or-admin.guard';

@Controller('posts/:postId/images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get('file/:filename')
  @IsPublic()
  async getImageFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const filePath = await this.imagesService.getImageFile(filename);
    return res.sendFile(filePath);
  }

  @Post()
  @UseGuards(AccessTokenGuard, IsPostMineOrAdminGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Param('postId') postId: string,
    @UploadedFile() image: Express.Multer.File,
    @Body('isThumbnail') isThumbnail: boolean = false,
  ) {
    const postImage = await this.imagesService.createPostImage(
      +postId,
      isThumbnail,
      image,
    );
    return { postImage };
  }
}
