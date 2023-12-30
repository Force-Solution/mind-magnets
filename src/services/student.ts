import { StudentRepo } from '@src/dao/repository/StudentRepo';
import { IStudent, IStudentDoc } from '@src/types/student';
import { IUserDoc } from '@src/types/user';

export const createStudent = async (
  student: IStudent,
  user: IUserDoc,
): Promise<IStudentDoc> => {
  const payload = {
    ...student,
    user: user._id.toString(),
  };
  return await new StudentRepo().saveStudent(payload);
};
