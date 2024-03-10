import { IBatchDoc } from '@src/types/batch';
import Batch from '@src/dao/model/batch';
import { BadRequestError } from '@src/core/API_Handler/ApiError';
import { IRequest } from '@src/types/request';

export class BatchRepo {
  batch: typeof Batch;
  constructor(){
    this.batch = Batch;
  }

  public async createBatch(batchBody: {name: string}): Promise<IBatchDoc> {
    if (await this.getBatchByName(batchBody.name)) {
      throw new BadRequestError('Duplicate Batch Name is not allowed');
    }
    return this.batch.create(batchBody);
  }

  public getBatchByName(batch: string): Promise<IBatchDoc | null> {
    return this.batch.findOne({ name: batch });
  }

  public async getBatchList(payload: Partial<IRequest>) {
    const data = await this.batch.find({})
      .skip(Number(payload.size) * Number(payload.page))
      .limit(Number(payload.size));
    const totalElements = await Batch.find({}).countDocuments();

    return {
      data: data,
      totalElements: totalElements ?? 0,
      totalPages: Math.ceil(totalElements / parseInt(payload.size ?? '0')),
    };
  }
}
