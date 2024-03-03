import { ClassRepo } from "@src/dao/repository/ClassRepo";
import { IClass, IClassDoc } from "@src/types/class";

export const createClass = async(payload: IClass): Promise<IClassDoc> => {
    return await new ClassRepo().createClass(payload);
}