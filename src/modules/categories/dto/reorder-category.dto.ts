import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CategoryOrderItem {
  @IsNumber()
  id: number;

  @IsNumber()
  pos: number;
}

export class ReorderCategoryDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryOrderItem)
  categoryOrders: CategoryOrderItem[];
}
