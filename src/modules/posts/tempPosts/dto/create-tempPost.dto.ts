import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateTempPostDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(6000)
  content: string;

  @IsString()
  @MaxLength(6000)
  contentSlate: string;
}
