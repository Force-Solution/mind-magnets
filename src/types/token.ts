import { JwtPayload } from 'jsonwebtoken';
import { Document, Model } from 'mongoose';

export interface IToken {
    token: string;
    user: string;
    type: string;
    expires: Date;
    blacklisted: boolean;
  }
  
  export interface IPayload extends JwtPayload {
    sub: string;
    iat: number;
    exp: number;
    type: string;
  }
  
  export interface TokenPayload {
    token: string;
    expires: Date;
  }
  
  export interface AccessAndRefreshTokens {
    access: TokenPayload;
    refresh: TokenPayload;
  }
  
  export type NewToken = Omit<IToken, 'blacklisted'>;
  
  export interface ITokenDoc extends IToken, Document {}
  export interface ITokenModel extends Model<ITokenDoc> {}
  
  export const enum tokenType {
    ACCESS = 'access',
    REFRESH = 'refresh',
    RESET_PASSWORD = 'resetPassword',
    VERIFY_EMAIL = 'verifyEmail',
  }