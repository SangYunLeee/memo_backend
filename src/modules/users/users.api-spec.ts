import { ApiEndpointOptions } from 'src/common/decorator/api-docs.decorator';

/**
 * Users 모듈 API 스펙 정의
 */
export const UsersApiSpec = {
  getMe: {
    method: 'get',
    path: 'me',
    summary: '내 정보 조회',
    description: '현재 로그인한 사용자의 정보를 조회합니다. 미로그인 시 null을 반환합니다.',
    auth: 'none',
    responses: {
      200: { description: '사용자 정보 조회 성공' },
    },
  },

  getUserById: {
    method: 'get',
    path: ':id',
    summary: 'ID로 사용자 조회',
    description: '사용자 ID로 사용자 정보를 조회합니다.',
    auth: 'none',
    responses: {
      200: { description: '사용자 정보 조회 성공' },
      404: { description: '사용자를 찾을 수 없음' },
    },
  },

  getUserByNickname: {
    method: 'get',
    path: 'nickname/:nickname',
    summary: '닉네임으로 사용자 조회',
    description: '닉네임으로 사용자 정보를 조회합니다.',
    auth: 'none',
    responses: {
      200: { description: '사용자 정보 조회 성공' },
      404: { description: '사용자를 찾을 수 없음' },
    },
  },

  updateMyProfile: {
    method: 'patch',
    path: 'me/profile',
    summary: '내 프로필 수정',
    description: '현재 로그인한 사용자의 프로필 정보를 수정합니다.',
    auth: 'cookie',
    responses: {
      200: { description: '프로필 수정 성공' },
      401: { description: '인증되지 않은 사용자' },
    },
  },
} as const satisfies Record<string, ApiEndpointOptions>;
