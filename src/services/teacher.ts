import { BadRequestError } from "@src/core/API_Handler/ApiError";
import { TeacherRepo } from "@src/dao/repository/TeacherRepo";
import { Duration } from "@src/types/roles";
import { ITeacher, ITeacherDoc } from "@src/types/teacher";
import { IUserDoc } from "@src/types/user";

export const createTeacher = async(teacher: ITeacher, user: IUserDoc): Promise<ITeacherDoc> => {
    const payload = {
        ...teacher,
        user: user._id
    }
    return await new TeacherRepo().saveTeacher(payload);
}

export const getTeachersData = async(duration: string) => {
    if(!(duration === Duration.Monthly || duration === Duration.Weekly)) {
      throw new BadRequestError('Duration is not valid');
    }
  
    return await new TeacherRepo().countStudentsByDuration(duration); 
  }