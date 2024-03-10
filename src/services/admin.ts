import { StudentService } from '@src/services/student';
import { TeacherService } from '@src/services/teacher';

export class AdminService {
  teacher: TeacherService;
  student: StudentService;
  constructor() {
    this.teacher = new TeacherService();
    this.student = new StudentService();
  }

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
