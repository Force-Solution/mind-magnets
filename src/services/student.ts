import { BadRequestError } from '@src/core/API_Handler/ApiError';
import { StudentRepo } from '@src/dao/repository/StudentRepo';
import { IPaymentDoc, PaymentTypes } from '@src/types/payment';
import { Duration } from '@src/types/roles';
import { IStudent, IStudentDoc } from '@src/types/student';
import { IUserDoc } from '@src/types/user';

export const createStudent = async (
  student: IStudent,
  user: IUserDoc,
  payment: IPaymentDoc
): Promise<IStudentDoc> => {
  const payload = {
    ...student,
    user: user._id,
    payment: payment._id
  };
  return await new StudentRepo().saveStudent(payload);
};

export const getStudentsData = async(duration: string) => {
  if(!(duration === Duration.Monthly || duration === Duration.Weekly)) {
    throw new BadRequestError('Duration is not valid');
  }

  return await new StudentRepo().countStudentsByDuration(duration); 
}

export const countPendingPaymentsPerBatchByInst = () => {
 return new StudentRepo().countPendingPaymentsPerBatch(PaymentTypes.Installments);
}

export const countTotalClass = (userId: number | string) => {
  return new StudentRepo().countClasses(userId);
}
