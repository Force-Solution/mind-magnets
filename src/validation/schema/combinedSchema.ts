import user from '@src/validation/schema/user';
import student from '@src/validation/schema/student';
import payment from '@src/validation/schema/payment';
import teacher from '@src/validation/schema/teacher';

const userCreateSchema = user.createUser;
const studentCreateSchema = student.createStudent;
const paymentCreateSchema = payment.createPayment;
const teacherCreateSchema = teacher.createTeacher;

export const studentRecordSchema = userCreateSchema.concat(studentCreateSchema).concat(paymentCreateSchema);

export const teacherRecordSchema = userCreateSchema.concat(teacherCreateSchema);