import { ApiPropertyOptions } from '@nestjs/swagger';

/**
 * RegisterUserDto API 스펙 정의
 */
export const RegisterUserDtoSpec: Record<string, ApiPropertyOptions> = {
  nickname: {
    description: '사용자 닉네임',
    example: 'johndoe',
    minLength: 3,
    maxLength: 20,
  },

  email: {
    description: '이메일 주소',
    example: 'user@example.com',
    format: 'email',
  },

  password: {
    description: '비밀번호',
    example: 'password123',
    minLength: 3,
    maxLength: 20,
  },
};
