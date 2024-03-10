import Department from '@src/dao/model/department';
import { BadRequestError } from '@src/core/API_Handler/ApiError';
import { IDepartment, IDepartmentDoc } from '@src/types/department';
import { IRequest } from '@src/types/request';
import { injectable } from 'inversify';

@injectable()
export class DepartmentRepo {
  department: typeof Department;
  constructor() {
    this.department = Department;
  }

  public async isDuplicateDepartment(name: string): Promise<boolean> {
    return this.department.isDepartmentPresent(name);
  }

  public async createDepartment(body: IDepartment): Promise<IDepartmentDoc> {
    if (await this.isDuplicateDepartment(body.department)) {
      throw new BadRequestError('Duplicate Department Name is not allowed');
    }
    return this.department.create(body);
  }

  public async getDepartmentList(payload: Partial<IRequest>) {
    const data = await this.department
      .find({})
      .skip(Number(payload.size) * Number(payload.page))
      .limit(Number(payload.size));
    const totalElements = await Department.find({}).countDocuments();

    return {
      data: data,
      totalElements: totalElements ?? 0,
      totalPages: Math.ceil(totalElements / parseInt(payload.size ?? '0')),
    };
  }

  public async getDepartmentFromName(
    name: string,
  ): Promise<IDepartmentDoc | null> {
    return this.department.findOne({ department: name });
  }
}
