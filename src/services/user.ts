import {
  AuthFailureError,
  BadTokenError,
  NotFoundError,
} from '@src/core/API_Handler/ApiError';
import Token from '@src/dao/model/token';
import { PaymentRepo } from '@src/dao/repository/PaymentRepo';
import { UserRepo } from '@src/dao/repository/UserRepo';
import { IRole } from '@src/types/roles';
import { tokenType } from '@src/types/token';
import { IUser, IUserDoc } from '@src/types/user';

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

export const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenType.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc) throw new NotFoundError();

  await refreshTokenDoc.deleteOne();
};

export const createUser = async (user: IUser): Promise<IUserDoc> => {
  return await new UserRepo().createUser(user);
};

export const getDashboardKPIData = async (
  _userId: number | string,
  role: string | string[] | undefined,
) => {
  if (typeof role !== 'string') throw new BadTokenError();

  if (role === IRole.Admin) {
    const teachers =  await new UserRepo().countUserByRole(IRole.Teacher);
    const students =  await new UserRepo().countUserByRole(IRole.Student);
    const pendingDueByInstallments =  await new PaymentRepo().getPaymentPendingCountForInstallments();

    return {teacherCount: teachers, studentCount: students, pendingDueByInstallments};
  } else if (role === IRole.Teacher) {
  } else if (role === IRole.Parent) {
  } else if (role == IRole.Student) {
  } else {
    throw new BadTokenError();
  }
};
