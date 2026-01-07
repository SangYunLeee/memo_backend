# Swagger API 문서화 가이드

## 개요

이 프로젝트는 `@nestjs/swagger`를 사용하여 API 문서를 자동 생성합니다.
Swagger는 OpenAPI 3.0 표준을 따르며, AI가 쉽게 파싱하고 이해할 수 있는 구조화된 스키마를 제공합니다.

## 설치된 패키지

```bash
yarn add @nestjs/swagger@^8.0.0
```

- `@nestjs/swagger`: NestJS용 Swagger 통합 라이브러리 (Swagger UI 포함)

## 설정 파일

### main.ts (src/main.ts)

```typescript
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Swagger 설정
const config = new DocumentBuilder()
  .setTitle('Memo Backend API')
  .setDescription('Memo 백엔드 API 문서')
  .setVersion('1.0')
  .addCookieAuth('access_token', {
    type: 'apiKey',
    in: 'cookie',
    name: 'access_token',
  })
  .addTag('auth', '인증 관련 API')
  .addTag('users', '사용자 관련 API')
  .addTag('posts', '게시글 관련 API')
  .addTag('comments', '댓글 관련 API')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document);
```

## 사용 방법

### 1. 서버 실행

```bash
npm run start:dev
# 또는
yarn start:dev
```

### 2. API 문서 확인

브라우저에서 접속:
- **Swagger UI**: `http://localhost:3001/api-docs`
- **OpenAPI JSON**: `http://localhost:3001/api-docs-json`

### 3. DTO에 문서 추가

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    description: '현재 비밀번호',
    example: 'currentPass123',
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  @Length(3, 20)
  currentPassword: string;

  @ApiProperty({
    description: '새 비밀번호',
    example: 'newPass123',
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  @Length(3, 20)
  newPassword: string;
}
```

**ApiProperty 옵션:**
- `description`: 필드 설명
- `example`: 예시 값
- `required`: 필수 여부 (기본값: true)
- `nullable`: null 허용 여부
- `default`: 기본값
- `minLength`, `maxLength`: 문자열 길이 제한
- `minimum`, `maximum`: 숫자 범위 제한
- `enum`: 열거형 값

### 4. 컨트롤러에 문서 추가 (권장 방식: 커스텀 데코레이터)

이 프로젝트는 **코드 가독성**을 위해 커스텀 데코레이터 방식을 사용합니다.

#### 4-1. API 스펙 파일 작성

```typescript
// src/modules/auth/auth.api-spec.ts
import { ApiEndpointOptions } from 'src/common/decorator/api-docs.decorator';

export const AuthApiSpec: Record<string, ApiEndpointOptions> = {
  loginWithEmail: {
    summary: '이메일 로그인',
    description: '이메일과 비밀번호로 로그인하고 access_token을 쿠키로 발급받습니다.',
    auth: 'none', // 'cookie' | 'bearer' | 'none'
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

  updatePassword: {
    summary: '비밀번호 변경',
    description: '현재 비밀번호를 확인하고 새 비밀번호로 변경합니다.',
    auth: 'cookie',
    responses: {
      200: { description: '비밀번호 변경 성공' },
      401: { description: '현재 비밀번호 불일치' },
    },
  },
};
```

#### 4-2. 컨트롤러에서 사용

```typescript
import { ApiTags } from '@nestjs/swagger';
import { ApiEndpoint } from 'src/common/decorator/api-docs.decorator';
import { AuthApiSpec } from './auth.api-spec';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

  @Post('login/email')
  @ApiEndpoint(AuthApiSpec.loginWithEmail)
  async loginWithEmail(@Body() user: LoginDto) {
    // ...
  }

  @Patch('password')
  @ApiEndpoint(AuthApiSpec.updatePassword)
  async updatePassword(@Body() body: UpdatePasswordDto) {
    // ...
  }
}
```

**장점:**
- ✅ 컨트롤러 코드가 깔끔해짐
- ✅ API 스펙을 한 곳에서 관리
- ✅ 재사용 가능
- ✅ TypeScript 타입 검증

**커스텀 데코레이터 옵션:**
- `summary`: 엔드포인트 요약 (필수)
- `description`: 상세 설명
- `auth`: 인증 방식 (`'cookie'` | `'bearer'` | `'none'`)
- `body`: 요청 본문 스키마
- `responses`: HTTP 응답 정의 (상태 코드별)

### 5. 기존 방식 (Swagger 기본 데코레이터)

커스텀 데코레이터 없이 기본 Swagger 데코레이터만 사용하는 방식:

```typescript
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiCookieAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Post('login/email')
  @ApiOperation({ summary: '이메일 로그인' })
  @ApiBody({ schema: { ... } })
  @ApiResponse({ status: 200, description: '성공' })
  async loginWithEmail() { }
}
```

**기본 데코레이터:**
- `@ApiTags()`: 컨트롤러를 그룹화
- `@ApiOperation()`: 엔드포인트 설명
- `@ApiResponse()`: HTTP 응답 스키마
- `@ApiBody()`: 요청 본문 스키마
- `@ApiCookieAuth()`: 쿠키 인증 필요
- `@ApiBearerAuth()`: Bearer 토큰 인증 필요
- `@ApiParam()`: 경로 파라미터
- `@ApiQuery()`: 쿼리 파라미터

## PickType 사용 시 주의사항

`PickType`을 사용할 때는 `@nestjs/mapped-types` 대신 `@nestjs/swagger`에서 import해야 Swagger가 스키마를 인식합니다:

```typescript
// ❌ 잘못된 방법
import { PickType } from '@nestjs/mapped-types';

// ✅ 올바른 방법
import { PickType } from '@nestjs/swagger';
```

## 프로젝트 구조

```
src/
├── common/
│   └── decorator/
│       └── api-docs.decorator.ts     # 커스텀 @ApiEndpoint 데코레이터
├── modules/
│   └── auth/
│       ├── auth.controller.ts        # 컨트롤러 (간결)
│       ├── auth.api-spec.ts          # API 스펙 정의 (분리)
│       └── dto/
│           └── update-password.dto.ts # DTO with @ApiProperty
```

## 완료된 문서화 예시

### 커스텀 데코레이터
- `src/common/decorator/api-docs.decorator.ts` - `@ApiEndpoint` 통합 데코레이터

### API 스펙 파일
- `src/modules/auth/auth.api-spec.ts` - Auth 모듈 API 스펙

### DTO
- `src/modules/auth/dto/update-password.dto.ts` - 비밀번호 변경
- `src/modules/posts/dto/create-post.dtoModel.ts` - 게시글 생성

### 컨트롤러
- `src/modules/auth/auth.controller.ts` - 인증 관련 전체 엔드포인트 (커스텀 데코레이터 적용)
  - POST `/auth/login/email` - 이메일 로그인
  - POST `/auth/register/email` - 회원가입
  - PATCH `/auth/password` - 비밀번호 변경
  - GET `/auth/logout` - 로그아웃

## AI와 함께 사용하기

### OpenAPI JSON 내보내기

```bash
# 서버 실행 후
curl http://localhost:3001/api-docs-json > openapi.json
```

### AI에게 API 스펙 제공

1. OpenAPI JSON 파일을 AI에게 제공
2. AI가 전체 API 구조를 이해하고 분석
3. AI가 문서를 기반으로 클라이언트 코드 생성, 테스트 작성, API 개선 제안 등 수행 가능

### 장점

- **구조화된 스키마**: AI가 파싱하기 쉬운 JSON/YAML 형식
- **표준 기반**: OpenAPI 3.0 표준으로 다양한 도구와 호환
- **자동 동기화**: 코드 변경 시 문서도 자동 업데이트
- **단일 진실 공급원**: 코드와 문서가 일원화되어 불일치 방지

## 다른 컨트롤러 문서화 방법

현재 인증(auth) 관련 API만 문서화되었습니다. 다른 컨트롤러도 같은 패턴으로 문서화할 수 있습니다:

### 단계별 가이드

1. **API 스펙 파일 생성**
   ```typescript
   // src/modules/posts/posts.api-spec.ts
   export const PostsApiSpec: Record<string, ApiEndpointOptions> = {
     createPost: {
       summary: '게시글 작성',
       auth: 'cookie',
       responses: {
         201: { description: '게시글 생성 성공' },
       },
     },
   };
   ```

2. **컨트롤러에 적용**
   ```typescript
   import { ApiEndpoint } from 'src/common/decorator/api-docs.decorator';
   import { PostsApiSpec } from './posts.api-spec';

   @ApiTags('posts')
   @Controller('posts')
   export class PostsController {
     @Post()
     @ApiEndpoint(PostsApiSpec.createPost)
     async create() { }
   }
   ```

### 문서화 대상 컨트롤러

- [ ] `src/modules/users/` - 사용자 관련 API
- [ ] `src/modules/posts/posts.controller.ts` - 게시글 CRUD
- [ ] `src/modules/posts/comments/comments.controller.ts` - 댓글 관련
- [ ] `src/modules/posts/images/images.controller.ts` - 이미지 업로드
- [ ] `src/modules/posts/files/postFiles.controller.ts` - 파일 관리
- [ ] `src/modules/posts/tempPosts/tempPost.controller.ts` - 임시 저장

## 참고 자료

- [NestJS Swagger 공식 문서](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI 3.0 스펙](https://swagger.io/specification/)
