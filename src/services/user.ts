import {
  AuthFailureError,
  BadTokenError,
  NotFoundError,
} from '@src/core/API_Handler/ApiError';

import { UserRepo } from '@src/dao/repository/UserRepo';
import { PaymentTypes } from '@src/types/payment';
import { IRole } from '@src/types/roles';
import { tokenType } from '@src/types/token';
import { IUser, IUserDoc } from '@src/types/user';

import * as PaymentService from '@src/services/payment';
import * as TokenService from '@src/services/token';

export const loginWithEmailAndPassword = async (
  email: string,
  password: string,
):Promise<IUserDoc> => {
  const user = await new UserRepo().getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new AuthFailureError('Incorrect email or password');
  }
  return user;
};

export const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenDoc = await TokenService.verifyToken({
    token: refreshToken,
    type: tokenType.REFRESH,
    blacklisted: false,
  });

  if (!refreshTokenDoc) throw new NotFoundError();

  await TokenService.deleteToken(refreshTokenDoc);
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
    const pendingDueByInstallments =  await PaymentService.getPaymentPendingCountOfInstallments();

    return {teacherCount: teachers, studentCount: students, pendingDueByInstallments};
  } else if (role === IRole.Teacher) {
  } else if (role === IRole.Parent) {
  } else if (role == IRole.Student) {
  } else {
    throw new BadTokenError();
  }
};

export const countPendingPaymentsPerBatchByInst = async() => {
 return  await new UserRepo().countPendingPaymentsPerBatch(PaymentTypes.Installments);
}
