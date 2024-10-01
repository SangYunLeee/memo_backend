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
import { CategoryIsMine } from './guard/is-category-mine-or-admin.guard';
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(CategoryIsMine)
  async createPost(@Body() postDto: CreatePostDto, @User('id') userId: number) {
    postDto.assign({ userId });
    const post = await this.postsService.createPost(postDto);
    return { post };
  }

  @Get()
  @IsPublic()
  async getPosts(@Query() query: PaginatePostDto, @User('id') userId?: number) {
    query.assign({ userId });
    const posts = await this.postsService.paginatePosts(query);
    return { posts };
  }

  @Get(':postId')
  @IsPublic()
  async getPostById(
    @Param('postId') postId: string,
    @User('id') userId?: number,
  ) {
    const post = await this.postsService.getPostById(+postId, userId);
    return { post };
  }

  @Patch(':postId')
  @UseGuards(IsPostMineOrAdminGuard)
  @UseGuards(CategoryIsMine)
  async updatePost(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @User('id') userId: number,
  ) {
    updatePostDto.assign({ userId });
    const post = await this.postsService.updatePost(+postId, updatePostDto);
    return { post };
  }

  @Delete(':postId')
  @UseGuards(IsPostMineOrAdminGuard)
  deletePostById(@Param('postId') postId: string, @User('id') userId: number) {
    return this.postsService.deletePostById(+postId, userId);
  }
}
