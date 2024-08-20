import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { User } from '../users/decorator/user.decorator';
import { PaginatePostDto } from './dto/paginte-post.dto';
import { IsPostMineOrAdminGuard } from './guard/is-post-mine-or-admin.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async createPost(@Body() postDto: CreatePostDto, @User('id') userId: number) {
    const post = await this.postsService.createPost(postDto, userId);
    return { post };
  }

  @Get()
  @IsPublic()
  async getPosts(@Query() query: PaginatePostDto) {
    const posts = await this.postsService.paginatePosts(query);
    return { posts };
  }

  @Get(':postId')
  @IsPublic()
  async getPostById(@Param('postId') postId: string) {
    const post = await this.postsService.getPostById(+postId);
    return { post };
  }

  @Patch(':postId')
  @UseGuards(IsPostMineOrAdminGuard)
  updatePost(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.updatePost(+postId, updatePostDto);
  }

  @Delete(':postId')
  @UseGuards(IsPostMineOrAdminGuard)
  deletePostById(@Param('postId') postId: string) {
    return this.postsService.deletePostById(+postId);
  }
}
