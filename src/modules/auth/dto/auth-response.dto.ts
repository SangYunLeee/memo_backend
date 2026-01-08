import { ApiProperty } from '@nestjs/swagger';
import { UsersModel } from 'src/modules/users/entity/users.entity';

export class TokenDto {
  @ApiProperty({ description: 'Access Token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ description: 'Refresh Token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refreshToken: string;
}

export class AuthResponseDto {
  @ApiProperty({ description: '사용자 정보', type: () => UsersModel })
  user: UsersModel;

  @ApiProperty({ description: '토큰 정보', type: TokenDto })
  token: TokenDto;
}

export class TokenAccessResponseDto {
  @ApiProperty({ description: 'Access Token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;
}

export class TokenRefreshResponseDto {
  @ApiProperty({ description: 'Refresh Token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refreshToken: string;
}

export class UpdatePasswordResponseDto {
  @ApiProperty({ description: '응답 메시지', example: '비밀번호가 변경되었습니다.' })
  message: string;
}

export class LogoutResponseDto {
  @ApiProperty({ description: '응답 메시지', example: 'Logged out successfully' })
  message: string;
}
