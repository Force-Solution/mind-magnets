import { IStudent, IStudentDoc } from '@src/types/student';
import Student from '@src/dao/model/student';

export class StudentRepo {
  public async saveStudent(student: IStudent): Promise<IStudentDoc> {
    return Student.create(student);
  }
}
