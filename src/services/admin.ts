import { StudentService } from '@src/services/student';
import { TeacherService } from '@src/services/teacher';
import { TYPES } from '@src/types/types';
import { injectable, inject } from 'inversify';
@injectable()
export class AdminService {
  constructor(
    @inject(TYPES.TeacherService) private teacher: TeacherService,
    @inject(TYPES.StudentService) private student: StudentService,
  ) {}

  public async getFilteredUsers(duration: string): Promise<{
    students: {
      label: string;
      count: number;
    }[];
    teachers: {
      label: string;
      count: number;
    }[];
  }> {
    const students = await this.student.getStudentsData(duration);
    const teachers = await this.teacher.getTeachersData(duration);

    const result = {
      students,
      teachers,
    };

    return result;
  }
}
