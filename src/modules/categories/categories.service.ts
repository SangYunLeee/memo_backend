import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryModel } from './entities/category.entity';
import { In, QueryRunner, Repository } from 'typeorm';
import { ReorderCategoryDto } from './dto/reorder-category.dto';
import { PostStatus } from '../posts/entities/post.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryModel)
    private readonly categoriesRepository: Repository<CategoryModel>,
  ) {}
  async create(userId: number, createCategoryDto: CreateCategoryDto) {
    return await this.categoriesRepository.save({
      ...createCategoryDto,
      user: { id: userId },
    });
  }

  getCategoryRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository(CategoryModel)
      : this.categoriesRepository;
  }

  async updateCategoryPostCount(
    categoryId: number,
    userId: number,
    qr?: QueryRunner,
  ) {
    if (categoryId == undefined) {
      throw new Error('Category ID is undefined');
    }
    const repo = this.getCategoryRepository(qr);

    // 임시글(status_id = 1)과 등록글(status_id = 2) 개수를 각각 계산
    const [tempCount, publishedCount] = await Promise.all([
      repo
        .createQueryBuilder('category')
        .select('COUNT(*)', 'count')
        .innerJoin('posts', 'post', 'post.cate_id = category.id')
        .where('category.id = :categoryId', { categoryId })
        .andWhere('post.status_id = :statusId', { statusId: PostStatus.DRAFT })
        .getRawOne()
        .then((result) => result?.count || 0),

      repo
        .createQueryBuilder('category')
        .select('COUNT(*)', 'count')
        .innerJoin('posts', 'post', 'post.cate_id = category.id')
        .where('category.id = :categoryId', { categoryId })
        .andWhere('post.status_id = :statusId', {
          statusId: PostStatus.PUBLISHED,
        })
        .getRawOne()
        .then((result) => result?.count || 0),
    ]);

    console.log('tempCount: ', tempCount);
    console.log('publishedCount: ', publishedCount);
    // 카테고리 업데이트
    await repo.update(
      { id: categoryId, user: { id: userId } },
      {
        postCount: publishedCount,
        tempPostCount: tempCount,
      },
    );
  }

  async findAll({ authorId, ids }: { authorId?: number; ids?: number[] } = {}) {
    return await this.categoriesRepository.find({
      where: { user: { id: authorId }, id: ids ? In(ids) : undefined },
      select: {
        id: true,
        pos: true,
        categoryName: true,
        user: { id: true },
        postCount: true,
        tempPostCount: true,
      },
      relations: ['user'],
      order: { pos: 'ASC' },
    });
  }

  findOne(id: number) {
    return this.categoriesRepository.findOne({ where: { id } });
  }

  async exists(id: number, userId?: number) {
    return await this.categoriesRepository
      .count({ where: { id, user: { id: userId } } })
      .then((count) => count > 0);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const result = await this.categoriesRepository.update(
      id,
      updateCategoryDto,
    );
    if (result.affected === 0) {
      throw new Error('Category not found');
    }
    return await this.findOne(id);
  }

  remove(id: number) {
    return this.categoriesRepository.delete(id);
  }

  async reorderCategories(reorderDto: ReorderCategoryDto) {
    const { categoryOrders } = reorderDto;

    // 벌크 업데이트 수행
    await this.categoriesRepository
      .createQueryBuilder()
      .update(CategoryModel)
      .set({
        pos: () =>
          'CASE id ' +
          categoryOrders
            .map((item) => `WHEN ${item.id} THEN ${item.pos}`)
            .join(' ') +
          ' END',
      })
      .whereInIds(categoryOrders.map((item) => item.id))
      .execute();

    // 업데이트된 카테고리 반환
    return this.findAll({ ids: categoryOrders.map((item) => item.id) });
  }
}
