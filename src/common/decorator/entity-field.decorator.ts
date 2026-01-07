import { applyDecorators } from '@nestjs/common';
import { Column } from 'typeorm';
import { IsString, IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

// Nickname 필드 전용 데코레이터
export function Nickname() {
  return applyDecorators(
    ApiProperty({
      description: '사용자 닉네임',
      example: 'johndoe',
      minLength: 3,
      maxLength: 20,
    }),
    Column({
      unique: true,
      length: 20,
    }),
    IsString(),
    Length(3, 20),
  );
}

// Email 필드 전용 데코레이터
export function Email() {
  return applyDecorators(
    ApiProperty({
      description: '이메일 주소',
      example: 'user@example.com',
      format: 'email',
    }),
    Column({
      unique: true,
      length: 100,
    }),
    IsEmail(),
  );
}

// Password 필드 전용 데코레이터
export function Password() {
  return applyDecorators(
    ApiProperty({
      description: '비밀번호',
      example: 'password123',
      minLength: 3,
      maxLength: 20,
    }),
    Column(),
    IsString(),
    Length(3, 20),
    Exclude({ toPlainOnly: true }),
  );
}