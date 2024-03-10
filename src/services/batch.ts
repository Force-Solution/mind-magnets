import { BatchRepo } from '@src/dao/repository/BatchRepo';
import { IBatchDoc } from '@src/types/batch';
import { IRequest } from '@src/types/request';
import { TYPES } from '@src/types/types';
import { injectable, inject } from 'inversify';
@injectable()
export class BatchService{
  constructor(
    @inject(TYPES.BatchRepo) private batch: BatchRepo
  ){
  }
  public async getBatchByName(batch: string): Promise<IBatchDoc | null>{
    return await this.batch.getBatchByName(batch);
  };
  
  public async batchList( payload: Partial<IRequest>){
    return await this.batch.getBatchList(payload);
  }
  
  public async createBatch(payload: {name: string}){
    return await this.batch.createBatch(payload);
  }
}

