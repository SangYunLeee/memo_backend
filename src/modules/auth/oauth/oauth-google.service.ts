import { Injectable } from '@nestjs/common';
import { OAuthBaseService } from './oauth-base.service';
import axios from 'axios';

@Injectable()
export class GoogleOAuthService extends OAuthBaseService {
  async verifyToken(token: string) {
    const { data } = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return {
      email: data.email,
      nickname: data.name,
    };
  }
}
