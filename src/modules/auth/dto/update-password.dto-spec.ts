import { ApiPropertyOptions } from '@nestjs/swagger';

/**
 * UpdatePasswordDto API 스펙 정의
 */
export const UpdatePasswordDtoSpec: Record<string, ApiPropertyOptions> = {
  currentPassword: {
    description: '현재 비밀번호',
    example: 'currentPass123',
    minLength: 3,
    maxLength: 20,
  },

  newPassword: {
    description: '새 비밀번호',
    example: 'newPass123',
    minLength: 3,
    maxLength: 20,
  },
};
