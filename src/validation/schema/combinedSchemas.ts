import Joi from 'joi';
import user from '@src/validation/schema/user';
import student from '@src/validation/schema/student';
import payment from '@src/validation/schema/payment';

export const StudentSchema = Joi.object().keys({
  user: user.createUser,
  student: student.createStudent,
  payment: payment.createPayment,
});
