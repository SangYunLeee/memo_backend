import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDtoModel } from './create-post.dtoModel';

export class UpdatePostDtoModel extends PartialType(CreatePostDtoModel) {}
