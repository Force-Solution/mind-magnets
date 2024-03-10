import { TokenRepo } from '@src/dao/repository/TokenRepo';
import { IToken, ITokenDoc } from '@src/types/token';
import { IUserDoc } from '@src/types/user';

export class TokenService {
  token: TokenRepo;
  constructor() {
    this.token = new TokenRepo();
  }

  public async verifyToken(token: Partial<IToken>): Promise<ITokenDoc | null> {
    return await this.token.findToken(token);
  }
  public async deleteToken(token: ITokenDoc): Promise<void> {
    return await this.token.deleteToken(token);
  }

  public async generateToken(user: IUserDoc): Promise<{
    access: {
      token: string;
      expires: Date;
    };
    refresh: {
      token: string;
      expires: Date;
    };
  }> {
    return await this.token.generateAuthTokens(user);
  }

  public async generateVerifyEmailToken(user: IUserDoc): Promise<string> {
    return await this.token.generateVerifyEmailToken(user);
  }

  public async verifyTokenByType(
    token: string,
    type: string,
  ): Promise<ITokenDoc | null> {
    return await this.token.verifyToken(token, type);
  }
}
