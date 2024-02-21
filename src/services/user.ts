import {
  AuthFailureError,
  BadTokenError,
  NotFoundError,
} from '@src/core/API_Handler/ApiError';

import { UserRepo } from '@src/dao/repository/UserRepo';
import { IRole } from '@src/types/roles';
import { tokenType } from '@src/types/token';
import { IUser, IUserDoc } from '@src/types/user';

import * as PaymentService from '@src/services/payment';
import * as TokenService from '@src/services/token';
import * as StudentService from '@src/services/student';
import * as TeacherService from '@src/services/teacher';
import { PaymentTypes } from '@src/types/payment';

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
  userId: number | string,
  role: string | string[] | undefined,
) => {
  if (typeof role !== 'string') throw new BadTokenError();
 
  if (role === IRole.Admin) {
    const teachers =  await new UserRepo().countUserByRole(IRole.Teacher);
    const students =  await new UserRepo().countUserByRole(IRole.Student);
    const pendingDueByInstallments =  await PaymentService.getPaymentPendingCountByType(PaymentTypes.Installments);

    return {teacherCount: teachers, studentCount: students, pendingDueByInstallments};
  } else if (role === IRole.Teacher) {
     const totalStudents = await TeacherService.countTotalStudents(userId);
      console.log(totalStudents);
  } else if (role === IRole.Parent) {
  } else if (role === IRole.Student) {
    const totalClasses = await StudentService.countTotalClass(userId);
    console.log(totalClasses);
  } else {
    throw new BadTokenError();
  }
};

export const addPasswordToUser = async(email: string, password: string, token: string): Promise<IUserDoc | null> => {
  const tokenDoc = await TokenService.verifyTokenByType(token, tokenType.VERIFY_EMAIL);
  const user = await new UserRepo().getUserByEmail(email);

  if(!tokenDoc || !user ||  tokenDoc.user.toString() !== user._id.toString()) throw new BadTokenError();
  
  user.password = password;
  user.isEmailVerified = true;

  return await new UserRepo().updateUserPassword(user);
}
