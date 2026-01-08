import { ApiEndpointOptions } from 'src/common/decorator/api-docs.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import {
  AuthResponseDto,
  TokenAccessResponseDto,
  TokenRefreshResponseDto,
  UpdatePasswordResponseDto,
  LogoutResponseDto,
} from './dto/auth-response.dto';

/**
 * Auth 모듈 API 스펙 정의
 */
export const AuthApiSpec = {
  tokenAccess: {
    method: 'post',
    path: 'token/access',
    summary: 'Access 토큰 갱신',
    description: 'Refresh 토큰으로 새로운 Access 토큰을 발급받습니다.',
    auth: 'cookie',
    responses: {
      200: {
        description: 'Access 토큰 발급 성공',
        type: TokenAccessResponseDto,
        setCookies: ['access_token'],
      },
      401: { description: '유효하지 않은 Refresh 토큰' },
    },
  },

  tokenRefresh: {
    method: 'post',
    path: 'token/refresh',
    summary: 'Refresh 토큰 갱신',
    description: 'Refresh 토큰으로 새로운 Refresh 토큰을 발급받습니다.',
    auth: 'cookie',
    responses: {
      200: {
        description: 'Refresh 토큰 발급 성공',
        type: TokenRefreshResponseDto,
        setCookies: ['refresh_token'],
      },
      401: { description: '유효하지 않은 Refresh 토큰' },
    },
  },

  loginWithEmail: {
    method: 'post',
    path: 'login/email',
    summary: '이메일 로그인',
    description: '이메일과 비밀번호로 로그인하고 access_token을 쿠키로 발급받습니다.',
    auth: 'none',
    body: {
      type: LoginDto,
    },
    responses: {
      200: {
        description: '로그인 성공',
        type: AuthResponseDto,
        setCookies: ['access_token'],
      },
      401: { description: '인증 실패' },
    },
  },

  registerWithEmail: {
    method: 'post',
    path: 'register/email',
    summary: '이메일 회원가입',
    description: '이메일로 새 계정을 생성하고 자동 로그인합니다.',
    auth: 'none',
    body: {
      type: RegisterUserDto,
    },
    responses: {
      201: {
        description: '회원가입 성공',
        type: AuthResponseDto,
        setCookies: ['access_token'],
      },
      400: { description: '잘못된 요청 (이메일 중복 등)' },
    },
  },

  updatePassword: {
    method: 'patch',
    path: 'password',
    summary: '비밀번호 변경',
    description: '현재 비밀번호를 확인하고 새 비밀번호로 변경합니다.',
    auth: 'cookie',
    body: {
      type: UpdatePasswordDto,
    },
    responses: {
      200: { description: '비밀번호 변경 성공', type: UpdatePasswordResponseDto },
      401: { description: '현재 비밀번호 불일치' },
    },
  },

  logout: {
    method: 'get',
    path: 'logout',
    summary: '로그아웃',
    description: 'access_token 쿠키를 삭제하여 로그아웃합니다.',
    auth: 'none',
    responses: {
      200: {
        description: '로그아웃 성공',
        type: LogoutResponseDto,
        removeCookies: ['access_token'],
      },
    },
  },
} as const satisfies Record<string, ApiEndpointOptions>;
