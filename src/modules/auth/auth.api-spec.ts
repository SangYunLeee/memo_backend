import { ApiEndpointOptions } from 'src/common/decorator/api-docs.decorator';

/**
 * Auth 모듈 API 스펙 정의
 */
export const AuthApiSpec: Record<string, ApiEndpointOptions> = {
  loginWithEmail: {
    summary: '이메일 로그인',
    description: '이메일과 비밀번호로 로그인하고 access_token을 쿠키로 발급받습니다.',
    auth: 'none',
    body: {
      schema: {
        type: 'object',
        properties: {
          email: { type: 'string', example: 'user@example.com' },
          password: { type: 'string', example: 'password123' },
        },
        required: ['email', 'password'],
      },
    },
    responses: {
      200: { description: '로그인 성공' },
      401: { description: '인증 실패' },
    },
  },

  registerWithEmail: {
    summary: '이메일 회원가입',
    description: '이메일로 새 계정을 생성하고 자동 로그인합니다.',
    auth: 'none',
    responses: {
      201: { description: '회원가입 성공' },
      400: { description: '잘못된 요청 (이메일 중복 등)' },
    },
  },

  updatePassword: {
    summary: '비밀번호 변경',
    description: '현재 비밀번호를 확인하고 새 비밀번호로 변경합니다.',
    auth: 'cookie',
    responses: {
      200: { description: '비밀번호 변경 성공' },
      401: { description: '현재 비밀번호 불일치' },
    },
  },

  logout: {
    summary: '로그아웃',
    description: 'access_token 쿠키를 삭제하여 로그아웃합니다.',
    auth: 'none',
    responses: {
      200: { description: '로그아웃 성공' },
    },
  },
};
