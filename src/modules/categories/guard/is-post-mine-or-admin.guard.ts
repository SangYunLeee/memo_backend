import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CategoriesService } from '../categories.service';

@Injectable()
export class CategoryCheck implements CanActivate {
  constructor(private readonly categoryService: CategoriesService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { categoryId } = req.body;
    if (!categoryId) {
      return true;
    }
    const isOk = await this.categoryService.exists(categoryId);
    if (!isOk) {
      throw new UnauthorizedException('해당 카테고리가 존재하지 않습니다.');
    }
    return true;
  }
}
