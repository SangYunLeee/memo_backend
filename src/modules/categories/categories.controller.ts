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
  UseInterceptors,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AccessTokenGuard } from 'src/modules/auth/guard/bearer-token.guard';
import { User } from '../users/decorator/user.decorator';
import { PaginateCategoryDto } from './dto/paginte-category.dto';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { ReorderCategoryDto } from './dto/reorder-category.dto';
import { CategoryIsMine } from './guard/is-category-mine-or-admin.guard';
import { UpdateCategoryListDto } from './dto/update-category-list.dto';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { QueryRunner as QR } from 'src/common/decorator/query-runner.decorator';
import { QueryRunner } from 'typeorm';
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

  @Patch('list')
  @UseInterceptors(TransactionInterceptor)
  updateList(
    @Body() updateCategoryListDto: UpdateCategoryListDto,
    @QR() qr: QueryRunner,
    @User('id') userId: number,
  ) {
    return this.categoriesService.updateList(updateCategoryListDto, qr, userId);
  }

  @Patch(':id')
  @UseGuards(CategoryIsMine)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(CategoryIsMine)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
