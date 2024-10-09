import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryRunner, Repository } from 'typeorm';
import { PostsModel, PostVisibility } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginte-post.dto';
import { CommonService } from 'src/common/common.service';
import { omitBy, isNil } from 'lodash';
import { UsersService } from '../users/users.service';
import { SearchCondition } from 'src/common/dto/base-pagination.type';
import { TempPostsService } from './tempPosts/tempPosts.service';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
    private readonly tempPostsService: TempPostsService,
    private readonly commonService: CommonService,
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  private createBaseQueryBuilder(
    repo: Repository<PostsModel>,
    userId?: number,
  ) {
    const queryBuilder = repo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.status', 'status')
      .leftJoinAndSelect(
        'post.postFiles',
        'postFiles',
        'postFiles.pendingDeletion = :pendingDeletion',
        {
          pendingDeletion: false,
        },
      )
      .leftJoinAndSelect(
        'author.profileImage',
        'authorImage',
        'authorImage.is_profile_image = :isProfileImage',
        { isProfileImage: true },
      )
      .leftJoinAndSelect(
        'post.tempPost',
        'tempPost',
        'tempPost.authorId = :userId',
        { userId },
      );
    // 비공개 게시글은 작성자만 볼 수 있음
    if (userId) {
      queryBuilder.andWhere(
        '(post.visibilityId = :publicVisibility OR (post.visibilityId = :privateVisibility AND post.author.id = :userId))',
        {
          publicVisibility: PostVisibility.PUBLIC,
          privateVisibility: PostVisibility.PRIVATE,
          userId,
        },
      );
    } else {
      queryBuilder.andWhere('post.visibilityId = :publicVisibility', {
        publicVisibility: PostVisibility.PUBLIC,
      });
    }

    return queryBuilder;
  }

  getPostRepository(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository(PostsModel) : this.postsRepository;
  }

  async getPostById(
    id: number,
    userId?: number,
    qr?: QueryRunner,
  ): Promise<PostsModel> {
    const repo = this.getPostRepository(qr);
    const post = await this.createBaseQueryBuilder(repo, userId)
      .andWhere('post.id = :id', { id })
      .getOne();

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async createPostImage(postImgDto: any, qr?: QueryRunner) {
    //TODO: 이미지 업로드
  }

  async createPost(
    postDto: CreatePostDto,
    qr?: QueryRunner,
  ): Promise<PostsModel> {
    const repo = this.getPostRepository(qr);
    const post = repo.create({
      ...postDto,
      authorId: postDto.userId,
      statusId: postDto.statusId,
      categoryId: postDto.categoryId,
    });
    const createdPost = await repo.save(post);
    const newPost = await this.getPostById(createdPost.id, postDto.userId, qr);
    return newPost;
  }

  async countPost({
    categoryId,
    userId,
    statusId,
    qr,
  }: {
    categoryId: number;
    userId: number;
    statusId: number;
    qr?: QueryRunner;
  }) {
    const repo = this.getPostRepository(qr);
    return await repo.count({
      where: {
        category: { id: categoryId, user: { id: userId } },
        status: { id: statusId },
      },
    });
  }

  async deletePostById(id: number, userId: number): Promise<void> {
    const post = await this.getPostById(id, userId);
    await this.postsRepository.remove(post);
  }

  async updatePost(postId: number, postDto: UpdatePostDto) {
    const post = await this.getPostById(postId, postDto.userId);

    if (!post) {
      throw new NotFoundException();
    }

    const filteredDto = omitBy(postDto, isNil);

    const newPost = await this.postsRepository.save({
      id: post.id,
      ...filteredDto,
      status: postDto.statusId && { id: postDto.statusId },
      category: postDto.categoryId && { id: postDto.categoryId },
    });

    const updatedPost = await this.getPostById(newPost.id, postDto.userId);
    if (post.tempPost) {
      await this.tempPostsService.deleteTempPost(postDto.userId, postId);
    }
    return updatedPost;
  }

  async paginatePosts(dto: PaginatePostDto) {
    const { nickname, userId } = dto;
    if (nickname) {
      const user = await this.usersService.getUserByNickname(nickname);
      dto.assign<PaginatePostDto>({
        author_id: user?.id,
        stopFlag: !user,
      });
    }

    const queryBuilder = this.createBaseQueryBuilder(
      this.postsRepository,
      userId,
    );

    const posts = await this.commonService.paginate(
      dto,
      this.postsRepository,
      new SearchCondition({}),
      'posts',
      queryBuilder, // queryBuilder를 추가로 전달
    );
    return posts;
  }

  async generatePosts(userId: number) {
    for (let i = 0; i < 20; i++) {
      const postDto = new CreatePostDto();
      postDto.assign({
        userId,
        title: `임의 제목: ${i}`,
        content: `임의 내용:  ${i}`,
        contentSlate: JSON.stringify([
          {
            type: 'paragraph',
            children: [{ text: `${i} 임의 내용` }],
          },
        ]),
        statusId: 2,
      });
      await this.createPost(postDto);
    }
    return true;
  }

  async checkExistPost(id: number) {
    const post = await this.postsRepository.exists({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  }

  async isPostExist(postId: number, userId: number) {
    const exist = await this.postsRepository.exists({
      where: {
        id: postId,
        author: { id: userId },
      },
      relations: ['author'],
    });
    return exist;
  }
}
