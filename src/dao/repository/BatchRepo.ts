import { IBatch, IBatchDoc } from "@src/types/batch";
import Batch from "@src/dao/model/batch";
import { BadRequestError } from "@src/core/API_Handler/ApiError";

export class BatchRepo{

    public async createBatch(batchBody: IBatch):Promise<IBatchDoc>{
        if(await this.getBatchByName(batchBody.name)){
            throw new BadRequestError("Duplicate Batch Name is not allowed");
        }
        return Batch.create(batchBody);
    }

    public getBatchByName(batch: string): Promise<IBatchDoc | null>{
        return Batch.findOne({name: batch});
    }
}