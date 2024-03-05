import { BatchRepo } from '@src/dao/repository/BatchRepo';
import { IBatchDoc } from '@src/types/batch';
import { IRequest } from '@src/types/request';

export const getBatchByName = async (batch: string): Promise<IBatchDoc | null> => {
  return await new BatchRepo().getBatchByName(batch);
};

export const batchList = async( payload: Partial<IRequest>) => {
  return await new BatchRepo().getBatchList(payload);
}

export const createBatch = async(payload: {name: string}) => {
  return await new BatchRepo().createBatch(payload);
}