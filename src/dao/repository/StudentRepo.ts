import { IStudent, IStudentDoc } from '@src/types/student';
import { Duration } from '@src/types/roles';
import * as Pipeline from '@src/dao/repository/pipelines';

import Student from '@src/dao/model/student';
export class StudentRepo {
  student: typeof Student;

  constructor(){
    this.student = Student;
  }

  public saveStudent(student: IStudent): Promise<IStudentDoc> {
    return this.student.create(student);
  }

  public countPendingPaymentsPerBatch(
    paymentType: string,
  ): Promise<{ batch: string; count: number }[]> {
    const pipeline = Pipeline.getPendingPaymentsPerBatch(paymentType);
    return this.student.aggregate(pipeline);
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

    return this.student.aggregate(pipeline);
  }

  public countClasses(userId: number | string): Promise<{totalClasses: number}[]> {
    const pipeline = Pipeline.getClassesCount(userId);
    return this.student.aggregate(pipeline);
  }
}
