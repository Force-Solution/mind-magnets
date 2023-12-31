import { ITeacher, ITeacherDoc } from '@src/types/teacher';
import Teacher from '@src/dao/model/teacher';
import * as Pipeline from '@src/dao/repository/pipelines';
import { Duration } from '@src/types/roles';

export class TeacherRepo {
  public saveTeacher(teacher: ITeacher): Promise<ITeacherDoc> {
    return Teacher.create(teacher);
  }

  public countStudentsByDuration(
    duration: string,
  ): Promise<{ label: string; count: number }[]> {
    let pipeline = [];

    if (duration === Duration.Weekly) {
      const currentDate = new Date();
      const lastWeekDate = new Date(currentDate);
      lastWeekDate.setDate(currentDate.getDate() - 6);
      lastWeekDate.setHours(0, 0, 0, 0);

      pipeline = Pipeline.getWeeklyDataOfUserJoined(lastWeekDate, currentDate);
    } else if (duration === Duration.Monthly) {
      const currentDate = new Date();
      const previousDate = new Date(currentDate);
      previousDate.setMonth(currentDate.getMonth() - 11);
      previousDate.setHours(0, 0, 0, 0);
      previousDate.setDate(1);

      pipeline = Pipeline.getMonthlyDataOfUserJoined(previousDate, currentDate);
    }

    return Teacher.aggregate(pipeline);
  }
}
