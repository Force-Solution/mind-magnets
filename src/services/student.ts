import { BadRequestError } from '@src/core/API_Handler/ApiError';
import { StudentRepo } from '@src/dao/repository/StudentRepo';

import { PaymentTypes } from '@src/types/payment';
import { Duration } from '@src/types/roles';
import { IStudent, IStudentDoc } from '@src/types/student';
import { TYPES } from '@src/types/types';
import { injectable, inject } from 'inversify';
@injectable()
export class StudentService {
  constructor(
    @inject(TYPES.StudentRepo) private student: StudentRepo,
  ) {}

  public async saveStudent(
   payload: IStudent
  ): Promise<IStudentDoc> {  
    return this.student.saveStudent(payload);
  }

  public async getStudentsData(duration: string) {
    if (!(duration === Duration.Monthly || duration === Duration.Weekly)) {
      throw new BadRequestError('Duration is not valid');
    }

    return await this.student.countStudentsByDuration(duration);
  }

  public async countPendingPaymentsPerBatchByInst(): Promise<
    {
      batch: string;
      count: number;
    }[]
  > {
    return this.student.countPendingPaymentsPerBatch(PaymentTypes.Installments);
  }

  public async countTotalClass(userId: number | string) {
    return this.student.countClasses(userId);
  }
}
