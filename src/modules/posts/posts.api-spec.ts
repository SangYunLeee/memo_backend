import { ApiEndpointOptions } from 'src/common/decorator/api-docs.decorator';

/**
 * Posts 모듈 API 스펙 정의
 */
export const PostsApiSpec = {
  createPost: {
    method: 'post',
    path: '',
    summary: '게시글 작성',
    description: '새로운 게시글을 작성합니다.',
    auth: 'cookie',
    responses: {
      201: { description: '게시글 작성 성공' },
      400: { description: '잘못된 요청' },
      401: { description: '인증되지 않은 사용자' },
    },
  },

  getPosts: {
    method: 'get',
    path: '',
    summary: '게시글 목록 조회',
    description: '게시글 목록을 페이지네이션하여 조회합니다.',
    auth: 'none',
    responses: {
      200: { description: '게시글 목록 조회 성공' },
    },
  },

  getPostById: {
    method: 'get',
    path: ':postId',
    summary: '게시글 상세 조회',
    description: 'ID로 특정 게시글의 상세 정보를 조회합니다.',
    auth: 'none',
    responses: {
      200: { description: '게시글 조회 성공' },
      404: { description: '게시글을 찾을 수 없음' },
    },
  },

  updatePost: {
    method: 'patch',
    path: ':postId',
    summary: '게시글 수정',
    description: '기존 게시글을 수정합니다. 작성자 본인 또는 관리자만 가능합니다.',
    auth: 'cookie',
    responses: {
      200: { description: '게시글 수정 성공' },
      401: { description: '인증되지 않은 사용자' },
      403: { description: '권한 없음' },
      404: { description: '게시글을 찾을 수 없음' },
    },
  },

  deletePost: {
    method: 'delete',
    path: ':postId',
    summary: '게시글 삭제',
    description: '게시글을 삭제합니다. 작성자 본인 또는 관리자만 가능합니다.',
    auth: 'cookie',
    responses: {
      200: { description: '게시글 삭제 성공' },
      401: { description: '인증되지 않은 사용자' },
      403: { description: '권한 없음' },
      404: { description: '게시글을 찾을 수 없음' },
    },
  },
} as const satisfies Record<string, ApiEndpointOptions>;
