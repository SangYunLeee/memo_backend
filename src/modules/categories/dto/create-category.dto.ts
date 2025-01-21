import { PickType } from '@nestjs/mapped-types';
import { CategoryModel } from '../entities/category.entity';

export class CreateCategoryDto extends PickType(CategoryModel, [
  'pos',
  'categoryName',
  'parentId',
  'id',
]) {}
