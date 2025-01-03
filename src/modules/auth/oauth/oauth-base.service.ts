export abstract class OAuthBaseService {
  abstract verifyToken(
    token: string,
  ): Promise<{ email: string; nickname: string }>;
}
