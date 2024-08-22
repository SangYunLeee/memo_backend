import { PickType } from '@nestjs/mapped-types';
import { PostFilesModel } from '../entities/postFiles.entity';
import { IsNumber, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreatePostFilesDto extends PickType(PostFilesModel, [
  'originalFilename',
  'storedFilename',
  'fileSize',
  'filePath',
  'isTemporary',
  'description',
  'mimeType',
]) {
  @IsNumber()
  post_id: number;
}
