import { Controller, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/decorator/user.decorator';
import { PaginatePostDto } from './dto/paginte-post.dto';
import { IsPostMineOrAdminGuard } from './guard/is-post-mine-or-admin.guard';
import { CategoryIsMine } from './guard/is-category-mine-or-admin.guard';
import { ApiEndpoint } from 'src/common/decorator/api-docs.decorator';
import { PostsApiSpec } from './posts.api-spec';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(CategoryIsMine)
  @ApiEndpoint(PostsApiSpec.createPost)
  async createPost(@Body() postDto: CreatePostDto, @User('id') userId: number) {
    postDto.assign({ userId });
    const post = await this.postsService.createPost(postDto);
    return { post };
  }

  @ApiEndpoint(PostsApiSpec.getPosts)
  async getPosts(@Query() query: PaginatePostDto, @User('id') userId?: number) {
    query.assign({ userId });
    const posts = await this.postsService.paginatePosts(query);
    return { posts };
  }

  @ApiEndpoint(PostsApiSpec.getPostById)
  async getPostById(
    @Param('postId') postId: string,
    @User('id') userId?: number,
  ) {
    const post = await this.postsService.getPostById(+postId, userId);
    return { post };
  }

  @UseGuards(IsPostMineOrAdminGuard)
  @UseGuards(CategoryIsMine)
  @ApiEndpoint(PostsApiSpec.updatePost)
  async updatePost(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @User('id') userId: number,
  ) {
    updatePostDto.assign({ userId });
    const post = await this.postsService.updatePost(+postId, updatePostDto);
    return { post };
  }

  @UseGuards(IsPostMineOrAdminGuard)
  @ApiEndpoint(PostsApiSpec.deletePost)
  deletePostById(@Param('postId') postId: string, @User('id') userId: number) {
    return this.postsService.deletePostById(+postId, userId);
  }
}
