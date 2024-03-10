import { ClassRepo } from '@src/dao/repository/ClassRepo';
import { IClass, IClassDoc } from '@src/types/class';

import { BadRequestError } from '@src/core/API_Handler/ApiError';

import { BatchService } from '@src/services/batch';
import { UserService } from '@src/services/user';
import { TYPES } from '@src/types/types';
import { injectable, inject } from 'inversify';
@injectable()
export class ClassService {
  constructor(
    @inject(TYPES.ClassRepo) private classes: ClassRepo,
    @inject(TYPES.UserService) private user: UserService,
    @inject(TYPES.BatchService) private batch: BatchService,
  ) {}

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
    return await this.classes.createClass(payload);
  }

  public async getClass(userId: string): Promise<IClass[] | null> {
    const user = await this.user.getUserByUserId(userId);
    if (!user) throw new BadRequestError('Invalid userid');

    return await this.classes.classesByTeacher(user._id);
  }
}
