import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AccessTokenGuard } from 'src/modules/auth/guard/bearer-token.guard';
import { User } from '../users/decorator/user.decorator';
import { PaginateCategoryDto } from './dto/paginte-category.dto';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { ReorderCategoryDto } from './dto/reorder-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @User('id') userId: number,
  ) {
    return this.categoriesService.create(userId, createCategoryDto);
  }

  @Get()
  @IsPublic()
  async findAll(@Query() query: PaginateCategoryDto) {
    const categories = await this.categoriesService.findAll(query);
    return { categories };
  }

  @Get('me')
  findMine(@User('id') userId: number) {
    return this.categoriesService.findAll({ authorId: userId });
  }

  @Patch('reorder')
  async reorderCategories(@Body() reorderDto: ReorderCategoryDto) {
    return this.categoriesService.reorderCategories(reorderDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }


}
