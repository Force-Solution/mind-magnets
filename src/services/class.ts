import { ClassRepo } from '@src/dao/repository/ClassRepo';
import { IClass, IClassDoc } from '@src/types/class';

import { BadRequestError } from '@src/core/API_Handler/ApiError';

import { BatchService } from '@src/services/batch';
import { UserService } from '@src/services/user';

export class ClassService {
  class: ClassRepo;
  user: UserService;
  batch: BatchService;
  constructor() {
    this.class = new ClassRepo();
    this.user = new UserService();
    this.batch = new BatchService();
  }

  public async createClass(
    data: Omit<IClass, 'batch'> & { batch: string },
    userId: string,
  ): Promise<IClassDoc> {
    const user = await this.user.getUserByUserId(userId);
    if (!user) throw new BadRequestError('Invalid userid');

    const batch = await this.batch.getBatchByName(data.batch);
    if (!batch) throw new BadRequestError('Invalid batch');

    const payload = {
      ...data,
      teacher: user?._id,
      batch: batch?._id,
    };
    return await this.class.createClass(payload);
  }

  public async getClass(userId: string): Promise<IClass[] | null> {
    const user = await this.user.getUserByUserId(userId);
    if (!user) throw new BadRequestError('Invalid userid');

    return await this.class.classesByTeacher(user._id);
  }
}
