import { DepartmentRepo } from "@src/dao/repository/DepartmentRepo";
import { IDepartment, IDepartmentDoc } from "@src/types/department";

export const isDepartmentPresentByName = async (department: string): Promise<boolean> => {
  return await new DepartmentRepo().isDuplicateDepartment(department);
};

export const createDepartment = async(department: IDepartment): Promise< IDepartmentDoc> => {
    return await new DepartmentRepo().createDepartment(department);
}
