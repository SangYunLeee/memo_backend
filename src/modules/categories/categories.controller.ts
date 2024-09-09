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

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @User('id') userId: number,
  ) {
    return this.categoriesService.create(userId, createCategoryDto);
  }

  @Get()
  async findAll(@Query() query: PaginateCategoryDto) {
    const categories = await this.categoriesService.findAll(query);
    return { categories };
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  findMine(@User('id') userId: number) {
    return this.categoriesService.findAll({ userId });
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
