import { PartialType } from '@nestjs/mapped-types';
import { CreateTempPostDto } from './create-tempPost.dto';

export class UpdateTempPostDto extends PartialType(CreateTempPostDto) {}
