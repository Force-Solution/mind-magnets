
import Department from "@src/dao/model/department";
import { BadRequestError } from "@src/core/API_Handler/ApiError";
import { IDepartment, IDepartmentDoc } from "@src/types/department";

export class DepartmentRepo{
    public async isDuplicateDepartment(name: string): Promise<boolean>{
        return Department.isDepartmentPresent(name);
    }

    public async createDepartment(body: IDepartment):Promise<IDepartmentDoc>{
        if(await this.isDuplicateDepartment(body.name)){
            throw new BadRequestError("Duplicate Department Name is not allowed");
        }
        return Department.create(body);
    }


    // public getBatchByName(batch: string): Promise<IBatchDoc | null>{
    //     return Batch.findOne({name: batch});
    // }
}