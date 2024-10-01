import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { TempPostsService } from './tempPosts.service';
import { User } from 'src/modules/users/decorator/user.decorator';
import { CreateTempPostDto } from './dto/create-tempPost.dto';
import { UpdateTempPostDto } from './dto/update-tempPost.dto';
import { IsPostMineOrAdminGuard } from '../guard/is-post-mine-or-admin.guard';
@Controller('posts')
export class TempPostsController {
  constructor(private readonly tempPostsService: TempPostsService) {}

  @Get(':postId/temp')
  @UseGuards(IsPostMineOrAdminGuard)
  findOne(
    @User('id') userId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.tempPostsService.getTempPostByPostId(userId, postId);
  }

  @Put(':postId/temp')
  @UseGuards(IsPostMineOrAdminGuard)
  update(
    @User('id') userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() updateTempPostDto: UpdateTempPostDto,
  ) {
    return this.tempPostsService.updateTempPost(
      userId,
      +postId,
      updateTempPostDto,
    );
  }

  @Delete(':postId/temp')
  @UseGuards(IsPostMineOrAdminGuard)
  remove(
    @User('id') userId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.tempPostsService.deleteTempPost(userId, postId);
  }
}
