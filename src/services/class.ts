import { ClassRepo } from "@src/dao/repository/ClassRepo";
import { IClass, IClassDoc } from "@src/types/class";

import * as userService from '@src/services/user';
import * as teacherService from '@src/services/teacher';
import * as batchService from '@src/services/batch';

import { BadRequestError } from "@src/core/API_Handler/ApiError";

export const createClass = async(data: Omit<IClass, 'batch'> & {batch: string}, userId: string): Promise<IClassDoc> => {
    const user = await userService.getUserByUserId(userId);
    if(!user) throw new BadRequestError("Invalid userid");

    const teacher  = await teacherService.getTeacherFromUserId(user._id);
    if(!teacher) throw new BadRequestError("Invalid userid");

    const batch = await batchService.getBatchByName(data.batch);
    if(!batch) throw new BadRequestError("Invalid batch");

    const payload = {
        ...data,
        teacher: teacher?._id,
        batch: batch?._id
    }
    return await new ClassRepo().createClass(payload);
}

export const getClass = async(userId: string): Promise<IClass[] | null> =>{
    const user = await userService.getUserByUserId(userId);
    if(!user) throw new BadRequestError("Invalid userid");

    const teacher  = await teacherService.getTeacherFromUserId(user._id);
    if(!teacher) throw new BadRequestError("Invalid userid");

    return await new ClassRepo().classesByTeacher(teacher.id);
}