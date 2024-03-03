import { BadRequestError } from '@src/core/API_Handler/ApiError';
import { TeacherRepo } from '@src/dao/repository/TeacherRepo';
import { IClass } from '@src/types/class';
import { IRequest } from '@src/types/request';
import { Duration } from '@src/types/roles';
import { ITeacher, ITeacherDoc } from '@src/types/teacher';

import * as classService from "@src/services/class"

export const createTeacher = async (
 payload: Partial<ITeacher>
): Promise<ITeacherDoc> => {
  return await new TeacherRepo().saveTeacher(payload);
};

export const getTeachersData = async (duration: string) => {
  if (!(duration === Duration.Monthly || duration === Duration.Weekly)) {
    throw new BadRequestError('Duration is not valid');
  }

  return await new TeacherRepo().countTeachersByDuration(duration);
};

export const getTeachersList = async (
  payload: Partial<IRequest>,
): Promise<{ [key in string]: string | Object[] | number }> => {
  const response = await new TeacherRepo().getAllTeacherData(payload);
  return {
    data: response[0].data,
    totalElements: response[0].metadata[0].totalCount ?? 0,
    totalPages: Math.ceil(
      parseInt(response[0].metadata[0].totalCount ?? 0) / parseInt(payload.size ?? '0'),
    ),
  };
};

export const createClass = async(payload: IClass) => {
  return await classService.createClass(payload);
}