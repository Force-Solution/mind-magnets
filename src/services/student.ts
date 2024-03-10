import { BadRequestError } from '@src/core/API_Handler/ApiError';
import { StudentRepo } from '@src/dao/repository/StudentRepo';

import { BatchService } from '@src/services/batch';
import { PaymentService } from '@src/services/payment';
import { TokenService } from '@src/services/token';
import { UserService } from '@src/services/user';

import { IPayment, IPaymentDoc, PaymentTypes } from '@src/types/payment';
import { Duration } from '@src/types/roles';
import { IStudent, IStudentDoc } from '@src/types/student';
import { IUser, IUserDoc } from '@src/types/user';

export class StudentService {
  user: UserService;
  payment: PaymentService;
  batch: BatchService;
  token: TokenService;
  student: StudentRepo;
  constructor() {
    this.user = new UserService();
    this.payment = new PaymentService();
    this.batch = new BatchService();
    this.token = new TokenService();
    this.student = new StudentRepo();
  }

  public async createStudent(
    student: IUser & IStudent & IPayment,
  ): Promise<(IUserDoc | IStudentDoc | IPaymentDoc | string)[]> {
    const batch = await this.batch.getBatchByName(student.batch.toString());
    if (!batch) throw new BadRequestError('Batch Name not Found');
    student.batch = batch._id;

    const user = await this.user.createUser(student);
    const payment = await this.payment.savePayment(student);

    const payload = {
      ...student,
      user: user._id,
      payment: payment._id,
    };
    const createdStudent = await this.student.saveStudent(payload);

    const token = await this.token.generateVerifyEmailToken(user);
    return Promise.all([user, createdStudent, payment, token]);
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
