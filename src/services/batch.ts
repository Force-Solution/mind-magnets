import { BatchRepo } from '@src/dao/repository/BatchRepo';
import { IBatchDoc } from '@src/types/batch';

export const getBatchByName = async (batch: string): Promise<IBatchDoc | null> => {
  return await new BatchRepo().getBatchByName(batch);
};
