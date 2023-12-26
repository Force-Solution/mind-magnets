import { IPayment, IPaymentDoc } from '@src/types/payment';
import { IStudent, IStudentDoc } from '@src/types/student';
import { IUser, IUserDoc } from '@src/types/user';
import { ITeacher, ITeacherDoc } from '@src/types/teacher';

import * as userService from '@src/services/user';
import * as studentService from '@src/services/student';
import * as paymentService from '@src/services/payment';
import * as teacherService from '@src/services/teacher';

export const createStudent = async (student: IUser & IStudent & IPayment): Promise<(IUserDoc | IStudentDoc | IPaymentDoc)[]> => {
   const user =  await userService.createUser(student);
   const createdStudent =  await studentService.createStudent(student, user);
   const payment = await paymentService.savePayment(student, user);
   return Promise.all([user, createdStudent, payment]);
}

export const createTeacher = async(teacher: IUser & ITeacher):Promise<(IUserDoc | ITeacherDoc)[]> => {
   const user = await userService.createUser(teacher);

   return Promise.all([user]);
}