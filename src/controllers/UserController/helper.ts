import { AuthFailureError, NotFoundError } from '@src/core/API_Handler/ApiError';
import Token from '@src/dao/model/token';
import { UserRepo } from '@src/dao/repository/UserRepo';
import { tokenType } from '@src/types/token';
import { IUserDoc } from '@src/types/user';

export const loginWithEmailAndPassword = async (
  email: string,
  password: string,
): Promise<IUserDoc> => {
  const user = await new UserRepo().getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new AuthFailureError('Incorrect email or password');
  }
  return user;
};

export const logout = async(refreshToken: string): Promise<void>  => {
  const refreshTokenDoc = await Token.findOne({token: refreshToken, type: tokenType.REFRESH, blacklisted: false});
  if(!refreshTokenDoc) throw new NotFoundError();

  await refreshTokenDoc.deleteOne();
}