import Department from '@src/dao/model/department';
import { BadRequestError } from '@src/core/API_Handler/ApiError';
import { IDepartment, IDepartmentDoc } from '@src/types/department';
import { IRequest } from '@src/types/request';

export class DepartmentRepo {
  public async isDuplicateDepartment(name: string): Promise<boolean> {
    return Department.isDepartmentPresent(name);
  }

  public async createDepartment(body: IDepartment): Promise<IDepartmentDoc> {
    if (await this.isDuplicateDepartment(body.department)) {
      throw new BadRequestError('Duplicate Department Name is not allowed');
    }
    return Department.create(body);
  }

  public async getDepartmentList(payload: IRequest) {
    const data =  await Department.find({})
      .skip(Number(payload.size) * (Number(payload.page)))
      .limit(Number(payload.size));
    const totalElements = await Department.find({}).countDocuments();

    return {
        data: data,
        totalElements: totalElements ?? 0,
        totalPages: Math.ceil(
          totalElements / parseInt(payload.size),
        ),
      };
  }

  // public getBatchByName(batch: string): Promise<IBatchDoc | null>{
  //     return Batch.findOne({name: batch});
  // }
}
