import * as teacherService from '@src/services/teacher';
import * as studentService from '@src/services/student';

export const getFilteredUsers = async (
  duration: string,
): Promise<{
  students: {
    label: string;
    count: number;
  }[];
  teachers: {
    label: string;
    count: number;
  }[];
}> => {
  const students = await studentService.getStudentsData(duration);
  const teachers = await teacherService.getTeachersData(duration);

  const result = {
    students,
    teachers,
  };

  return result;
};

