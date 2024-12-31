import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  content: string;
}
