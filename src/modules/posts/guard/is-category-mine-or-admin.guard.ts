import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CategoriesService } from '../../categories/categories.service';

@Injectable()
export class CategoryIsMine implements CanActivate {
  constructor(private readonly categoryService: CategoriesService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { categoryId } = req.body;
    const userId = req.user.id;
    if (!categoryId) {
      return true;
    }
    const isOk = await this.categoryService.exists(categoryId, userId);
    if (!isOk) {
      throw new UnauthorizedException('해당 카테고리가 존재하지 않습니다.');
    }
    return true;
  }
}
