import { TokenRepo } from '@src/dao/repository/TokenRepo';
import { IToken, ITokenDoc } from '@src/types/token';
import { IUserDoc } from '@src/types/user';

export const generateToken = async (
  user: IUserDoc,
): Promise<{
  access: {
    token: string;
    expires: Date;
  };
  refresh: {
    token: string;
    expires: Date;
  };
}> => {
  return await new TokenRepo().generateAuthTokens(user);
};

export const verifyToken = async (
  token: Partial<IToken>,
): Promise<ITokenDoc | null> => {
  return await new TokenRepo().findToken(token);
};

export const deleteToken = async(token: ITokenDoc): Promise<void> => {
    return await new TokenRepo().deleteToken(token);
}

export const generateVerifyEmailToken = async(user: IUserDoc): Promise<string> => {
  return await new TokenRepo().generateVerifyEmailToken(user);
}

export const verifyTokenByType = async(token: string, type: string): Promise<ITokenDoc | null> =>{
  return await new TokenRepo().verifyToken(token, type);
}