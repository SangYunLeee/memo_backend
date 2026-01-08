import { Response } from 'express';

/**
 * Access Token을 쿠키에 설정합니다.
 */
export function setAccessTokenCookie(response: Response, accessToken: string) {
  response.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  });
}
