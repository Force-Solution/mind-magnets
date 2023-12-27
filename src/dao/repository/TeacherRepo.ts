import { ITeacher, ITeacherDoc } from "@src/types/teacher";
import Teacher from "@src/dao/model/teacher";

export class TeacherRepo {
    public async saveTeacher(teacher: ITeacher): Promise<ITeacherDoc> {
      return Teacher.create(teacher);
    }
  }
  