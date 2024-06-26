import { DepartmentRepo } from '@src/dao/repository/DepartmentRepo';
import { IDepartment, IDepartmentDoc } from '@src/types/department';
import { IRequest } from '@src/types/request';
import { TYPES } from '@src/types/types';
import { injectable, inject } from 'inversify';

@injectable()
export class DepartmentService {
  constructor(
    @inject(TYPES.DepartmentRepo) private department: DepartmentRepo,
  ) {}
  public async isDepartmentPresentByName(department: string): Promise<boolean> {
    return await this.department.isDuplicateDepartment(department);
  }

  public async createDepartment(
    department: IDepartment,
  ): Promise<IDepartmentDoc> {
    return await this.department.createDepartment(department);
  }

  public async departmentList(payload: Partial<IRequest>) {
    return await this.department.getDepartmentList(payload);
  }

  public async getDepartmentFromName(
    department: string,
  ): Promise<IDepartmentDoc | null> {
    return await this.department.getDepartmentFromName(department);
  }
}
