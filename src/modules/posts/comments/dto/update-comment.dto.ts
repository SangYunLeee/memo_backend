import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  content: string;
}
