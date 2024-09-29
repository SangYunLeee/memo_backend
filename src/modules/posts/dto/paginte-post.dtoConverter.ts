import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';
import { PostsModel } from '../entities/post.entity';
import { BasePaginationConverter } from 'src/common/dto/base-pagination.dtoConverter';
import { PaginatePostDto } from './paginte-post.dto';
import { BaseModel } from 'src/common/entity/base.entity';

export class PostPaginationConverter<
  DTO extends BasePaginationDto,
  MODEL extends BaseModel,
> extends BasePaginationConverter<PaginatePostDto, PostsModel> {
  static postMappings: Partial<
    Record<
      keyof PaginatePostDto,
      {
        where?: [keyof PostsModel, string][];
        order?: [keyof PostsModel][];
      }
    >
  > = {
    content_include: { where: [['content', 'include']] },
    title_include: { where: [['title', 'include']] },
    content_or_title_include: {
      where: [
        ['content', 'include'],
        ['title', 'include'],
      ],
    },
    status_id: { where: [['statusId', 'equal']] },
    author_id: { where: [['authorId', 'equal']] },
    // nickname: { where: [['nickname', 'equal']] },
    category_id: { where: [['categoryId', 'equal']] },
  };

  getMappings(): Partial<
    Record<
      keyof PaginatePostDto,
      {
        where?: [keyof PostsModel, string][];
        order?: [keyof PostsModel][];
      }
    >
  > {
    return {
      ...super.getMappings(),
      ...PostPaginationConverter.postMappings,
    };
  }
}
