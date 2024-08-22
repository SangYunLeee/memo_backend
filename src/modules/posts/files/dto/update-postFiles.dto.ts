import { PartialType } from '@nestjs/mapped-types';
import { CreatePostFilesDto } from './create-postFiles.dto';

export class UpdatePostFilesDto extends PartialType(CreatePostFilesDto) {}
