import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryModel } from './entities/category.entity';
import { Repository } from 'typeorm';

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

  async findAll({ userId }: { userId?: number } = {}) {
    return await this.categoriesRepository.find({
      where: { user: { id: userId } },
      select: {
        id: true,
        pos: true,
        categoryName: true,
        user: { id: true },
      },
      relations: ['user'],
    });
  }

  findOne(id: number) {
    return this.categoriesRepository.findOne({ where: { id } });
  }

  async exists(id: number) {
    return await this.categoriesRepository
      .count({ where: { id } })
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
}
