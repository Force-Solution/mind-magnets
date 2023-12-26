import { TeacherRepo } from "@src/dao/repository/TeacherRepo";
import { ITeacher, ITeacherDoc } from "@src/types/teacher";
import { IUserDoc } from "@src/types/user";

export const createTeacher = async(teacher: ITeacher, user: IUserDoc): Promise<ITeacherDoc> => {
    const payload = {
        ...teacher,
        user: user._id.toString()
    }
    return await new TeacherRepo().saveTeacher(payload);
}