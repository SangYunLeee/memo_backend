import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryRunner, Repository } from 'typeorm';
import { PostsModel } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginte-post.dto';
import { CommonService } from 'src/common/common.service';
import { POST_FIND_OPTIONS } from './const/post-find-options';
import { omitBy, isNil } from 'lodash';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
    private readonly commonService: CommonService,
    private readonly usersService: UsersService,
  ) {}

  private createBaseQueryBuilder(repo: Repository<PostsModel>) {
    return repo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.status', 'status')
      .leftJoinAndSelect(
        'author.profileImage',
        'authorImage',
        'authorImage.is_profile_image = :isProfileImage',
        { isProfileImage: true },
      )
      .select(['post', 'author', 'category', 'status', 'authorImage']);
  }

  private mapPostUserImage(post: PostsModel): PostsModel {
    post.author.profileImage = post?.userImage || null;
    delete post.userImage;
    return post;
  }

  getPostRepository(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository(PostsModel) : this.postsRepository;
  }

  async getAllPosts() {
    const posts = await this.postsRepository.find({
      ...POST_FIND_OPTIONS,
    });
    return posts.map(this.mapPostUserImage);
  }

  async getPostById(id: number, qr?: QueryRunner): Promise<PostsModel> {
    const repo = this.getPostRepository(qr);
    const post = await this.createBaseQueryBuilder(repo)
      .where('post.id = :id', { id })
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
    authorId: number,
    qr?: QueryRunner,
  ): Promise<PostsModel> {
    const repo = this.getPostRepository(qr);
    const post = repo.create({
      ...postDto,
      author: { id: authorId },
      status: { id: postDto.statusId },
      category: { id: postDto.categoryId },
    });
    const createdPost = await repo.save(post);
    const newPost = await this.getPostById(createdPost.id, qr);
    return this.mapPostUserImage(newPost);
  }

  async deletePostById(id: number): Promise<void> {
    const post = await this.getPostById(id);
    await this.postsRepository.remove(post);
  }

  async updatePost(postId: number, postDto: UpdatePostDto) {
    // save의 기능
    // 1) 만약에 데이터가 존재하지 않는다면 (id 기준으로) 새로 생성한다.
    // 2) 만약에 데이터가 존재한다면 (같은 id의 값이 존재한다면) 존재하던 값을 업데이트한다.

    const post = await this.getPostById(postId);

    if (!post) {
      throw new NotFoundException();
    }

    const filteredDto = omitBy(postDto, isNil);

    const newPost = await this.postsRepository.save({
      ...post,
      ...filteredDto,
      status: postDto.statusId && { id: postDto.statusId },
      category: postDto.categoryId && { id: postDto.categoryId },
    });

    const updatedPost = await this.getPostById(newPost.id);
    return this.mapPostUserImage(updatedPost);
  }

  async paginatePosts(dto: PaginatePostDto) {
    const { nickname } = dto;
    if (nickname) {
      const user = await this.usersService.getUserByNickname(nickname);
      dto = {
        ...dto,
        where__and__author__id__equal: user?.id,
        stopFlag: !user,
      };
    }

    const queryBuilder = this.createBaseQueryBuilder(this.postsRepository);

    const posts = await this.commonService.paginate(
      dto,
      this.postsRepository,
      {},
      'posts',
      queryBuilder, // queryBuilder를 추가로 전달
    );
    return posts;
  }

  async generatePosts(userId: number) {
    for (let i = 0; i < 20; i++) {
      await this.createPost(
        {
          title: `임의 제목: ${i}`,
          content: `임의 내용:  ${i}`,
          contentSlate: JSON.stringify([
            {
              type: 'paragraph',
              children: [{ text: `${i} 임의 내용` }],
            },
          ]),
          statusId: 2,
        },
        userId,
      );
    }
    return true;
  }

  async checkExistPost(id: number) {
    const post = await this.postsRepository.exists({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  }

  async isPostMine(postId: number, userId: number) {
    console.log('postId:', postId);
    console.log('userId:', userId);
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
