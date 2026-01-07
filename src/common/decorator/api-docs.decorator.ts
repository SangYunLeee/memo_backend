import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiCookieAuth,
  ApiBearerAuth,
} from '@nestjs/swagger';

export interface ApiEndpointOptions {
  summary: string;
  description?: string;
  auth?: 'cookie' | 'bearer' | 'none';
  body?: {
    type?: Type<any>;
    schema?: any;
    description?: string;
  };
  responses?: {
    [statusCode: number]: {
      description: string;
      type?: Type<any>;
    };
  };
}

/**
 * API 엔드포인트를 문서화하는 통합 데코레이터
 *
 * @example
 * ```typescript
 * @ApiEndpoint({
 *   summary: '이메일 로그인',
 *   description: '이메일과 비밀번호로 로그인합니다.',
 *   auth: 'none',
 *   body: {
 *     schema: {
 *       type: 'object',
 *       properties: {
 *         email: { type: 'string', example: 'user@example.com' },
 *         password: { type: 'string', example: 'password123' },
 *       },
 *     },
 *   },
 *   responses: {
 *     200: { description: '로그인 성공' },
 *     401: { description: '인증 실패' },
 *   },
 * })
 * ```
 */
export function ApiEndpoint(options: ApiEndpointOptions) {
  const decorators = [
    ApiOperation({
      summary: options.summary,
      description: options.description,
    }),
  ];

  // 인증 데코레이터 추가
  if (options.auth === 'cookie') {
    decorators.push(ApiCookieAuth('access_token'));
  } else if (options.auth === 'bearer') {
    decorators.push(ApiBearerAuth());
  }

  // Body 데코레이터 추가
  if (options.body) {
    decorators.push(
      ApiBody({
        type: options.body.type,
        schema: options.body.schema,
        description: options.body.description,
      }),
    );
  }

  // Response 데코레이터 추가
  if (options.responses) {
    Object.entries(options.responses).forEach(([status, config]) => {
      decorators.push(
        ApiResponse({
          status: Number(status),
          description: config.description,
          type: config.type,
        }),
      );
    });
  }

  return applyDecorators(...decorators);
}
