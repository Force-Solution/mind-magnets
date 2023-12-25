import { IPayment, IPaymentDoc } from '@src/types/payment';
import { IStudent, IStudentDoc } from '@src/types/student';
import { IUser, IUserDoc } from '@src/types/user';

import * as userService from '@src/services/user';
import * as studentService from '@src/services/student';
import * as paymentService from '@src/services/payment';

export const createStudent = async (student: IUser & IStudent & IPayment): Promise<(IUserDoc | IStudentDoc | IPaymentDoc)[]> => {
   const user =  await userService.createUser(student);
   const createdStudent =  await studentService.createStudent(student, user);
   const payment = await paymentService.savePayment(student, user);
   return Promise.all([user, createdStudent, payment]);
}