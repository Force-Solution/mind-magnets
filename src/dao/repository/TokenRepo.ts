import mongoose from 'mongoose';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Token from '@src/dao/model/token';
import { tokenInfo } from '@src/config/configManager';
import { BadTokenError, TokenExpiredError } from '@src/core/API_Handler/ApiError';
import { constructDateFromUnix } from '@src/helper/util';
import { ITokenDoc, tokenType } from '@src/types/token';
import { IUserDoc } from '@src/types/user';

export class TokenRepo {
  public generateToken(
    userId: mongoose.Types.ObjectId,
    expires: number,
    type: string,
    secret: string,
    role: string
  ): string {
    /** add issuer when microservice architecture planned */
    const payload = {
      sub: userId,
      iat: Date.now(),
      exp: Date.now() + expires,
      aud: role,
      type,
    };
    return jwt.sign(payload, secret);
  }

  public async saveToken(
    token: string,
    userId: mongoose.Types.ObjectId,
    expires: number,
    type: string,
    blacklisted: boolean = false,
  ): Promise<ITokenDoc> {
    return await Token.create({
      token,
      user: userId,
      expires: constructDateFromUnix(Date.now() + expires),
      type,
      blacklisted,
    });
  }

  public async generateAuthTokens(user: IUserDoc) {
    const accessToken = this.generateToken(
      user._id,
      tokenInfo.accessTokenValidity,
      tokenType.ACCESS,
      tokenInfo.accessTokenSecret,
      user.role
    );

    const refreshToken = this.generateToken(
      user._id,
      tokenInfo.refreshTokenValidity,
      tokenType.REFRESH,
      tokenInfo.refreshTokenSecret,
      user.role
    );
    await this.saveToken(
      refreshToken,
      user._id,
      tokenInfo.refreshTokenValidity,
      tokenType.REFRESH,
    );

    return {
      access: {
        token: accessToken,
        expires: constructDateFromUnix(
          Date.now() + tokenInfo.accessTokenValidity,
        ),
      },
      refresh: {
        token: refreshToken,
        expires: constructDateFromUnix(
          Date.now() + tokenInfo.refreshTokenValidity,
        ),
      },
    };
  }

  public async verifyToken(token: string, type: string): Promise<ITokenDoc>{
    let payload:string | JwtPayload = "";
    if(type === tokenType.ACCESS) payload = jwt.verify(token, tokenInfo.accessTokenSecret);
    else if(type === tokenType.REFRESH) payload = jwt.verify(token, tokenInfo.refreshTokenSecret);

    if(typeof payload.sub !== "string") throw new BadTokenError();

    const tokenDoc = await Token.findOne({
        token,type,user:payload.sub, blacklisted: false
    });

    if(!tokenDoc) throw new TokenExpiredError();

    return tokenDoc;
  }
}
