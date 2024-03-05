import { BadRequestError } from '@src/core/API_Handler/ApiError';
import { StudentRepo } from '@src/dao/repository/StudentRepo';
import { IPayment, IPaymentDoc, PaymentTypes } from '@src/types/payment';
import { Duration } from '@src/types/roles';
import { IStudent, IStudentDoc } from '@src/types/student';
import { IUser, IUserDoc } from '@src/types/user';

import * as userService from '@src/services/user';
import * as paymentService from '@src/services/payment';
import * as BatchService from '@src/services/batch';
import * as tokenService from '@src/services/token';

export const createStudent = async (
  student: IUser & IStudent & IPayment,
): Promise<(IUserDoc | IStudentDoc | IPaymentDoc | string)[]> => {
  const batch = await BatchService.getBatchByName(student.batch.toString());
  if (!batch) throw new BadRequestError('Batch Name not Found');
  student.batch = batch._id;

  const user = await userService.createUser(student);
  const payment = await paymentService.savePayment(student);

  const payload = {
    ...student,
    user: user._id,
    payment: payment._id,
  };
  const createdStudent = await new StudentRepo().saveStudent(payload);

  const token = await tokenService.generateVerifyEmailToken(user);
  return Promise.all([user, createdStudent, payment, token]);
};

export const getStudentsData = async (duration: string) => {
  if (!(duration === Duration.Monthly || duration === Duration.Weekly)) {
    throw new BadRequestError('Duration is not valid');
  }

  return await new StudentRepo().countStudentsByDuration(duration);
};

export const countPendingPaymentsPerBatchByInst = (): Promise<
{
  batch: string;
  count: number;
}[]
> => {
  return new StudentRepo().countPendingPaymentsPerBatch(
    PaymentTypes.Installments,
  );
};

export const countTotalClass = (userId: number | string) => {
  return new StudentRepo().countClasses(userId);
};
