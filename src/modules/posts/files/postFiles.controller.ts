import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostFilesService } from './postFiles.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from 'src/modules/auth/guard/bearer-token.guard';
import { Response } from 'express';
import { IsPublic } from 'src/common/decorator/is-public.decorator';

@Controller('posts/:postId/files')
export class PostFilesController {
  constructor(private readonly postFilesService: PostFilesService) {}

  @Get('file/:filename')
  @IsPublic()
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = await this.postFilesService.getFile(filename);
    return res.sendFile(filePath);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('postId') postId: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.postFilesService.createPostFile(+postId, file);
  }

  @Delete(':fileId')
  @UseGuards(AccessTokenGuard)
  async deleteFile(@Param('fileId') fileId: number) {
    console.log(fileId);
    await this.postFilesService.deleteFile(fileId);
    return { message: 'File deleted' };
  }
}
