import mongoose from 'mongoose';

import { BadRequestError } from '@src/core/API_Handler/ApiError';
import { TeacherRepo } from '@src/dao/repository/TeacherRepo';
import { IRequest } from '@src/types/request';
import { Duration } from '@src/types/roles';
import { ITeacherDoc } from '@src/types/teacher';

import { TYPES } from '@src/types/types';
import { injectable, inject } from 'inversify';
@injectable()
export class TeacherService {
  constructor(
    @inject(TYPES.TeacherRepo) private teacher: TeacherRepo,
  ) {}
  public async saveTeacher(
    payload: Partial<ITeacherDoc>,
  ): Promise<ITeacherDoc> {
    return  await this.teacher.saveTeacher(payload);
  }

  public async getTeachersData(duration: string) {
    if (!(duration === Duration.Monthly || duration === Duration.Weekly)) {
      throw new BadRequestError('Duration is not valid');
    }

    return await this.teacher.countTeachersByDuration(duration);
  }

  public async getTeachersList(
    payload: Partial<IRequest>,
  ): Promise<{ [key in string]: string | Object[] | number }> {
    const response = await this.teacher.getAllTeacherData(payload);
    return {
      data: response[0].data,
      totalElements: response[0].metadata[0].totalCount ?? 0,
      totalPages: Math.ceil(
        parseInt(response[0].metadata[0].totalCount ?? 0) /
          parseInt(payload.size ?? '0'),
      ),
    };
  }

  public async getTeacherFromUserId(userId: mongoose.Types.ObjectId) {
    return await this.teacher.getTeacherFromUserId(userId);
  }
}
