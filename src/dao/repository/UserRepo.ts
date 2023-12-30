import { BadRequestError, message } from '@src/core/API_Handler/ApiError';
import User from '@src/dao/model/user';
import { IRole } from '@src/types/roles';
import { IUser, IUserDoc } from '@src/types/user';

export class UserRepo {
  public async createUser(userBody: IUser): Promise<IUserDoc> {
    if (await this.getUserByEmail(userBody.email)) {
      throw new BadRequestError(message.DuplicateEmail);
    }
    return User.create(userBody);
  }

  public getUserByEmail(email: string): Promise<IUserDoc | null> {
    return  User.findOne({ email });
  }

  public  countUserByRole(role: string): Promise<number> {
    return  User.countDocuments({ role });
  }

  public countPendingPaymentsPerBatch(
    paymentType: string,
  ): Promise<{ batch: string; pendingPayments: number }[]> {
    const pipeline = [
      { $match: { role: IRole.Student } },
      {
        $lookup: {
          from: 'Payment',
          localField: '_id',
          foreignField: 'user',
          as: 'pendingPayment',
        },
      },
      {
        $unwind: {
          path: '$pendingPayment',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          paymentType: paymentType,
          'pendingPayment.paid': false,
          'pendingPayment.dueDate': { $lte: new Date() },
        },
      },
      { $group: { _id: '$batch', count: { $sum: 1 } } },
      { $project: { _id: 0, batch: '$_id', pendingPayments: '$count' } },
    ];
    return User.aggregate(pipeline);
  }
}
