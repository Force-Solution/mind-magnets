import mongoose from 'mongoose';
import Test from '@src/dao/model/test';
import { injectable } from 'inversify';
import { ITest } from '@src/types/test';
@injectable()
export class TestRepo {
  test: typeof Test;
  constructor() {
    this.test = Test;
  }
  public async getAllTestsByTeacher(id: mongoose.Types.ObjectId) {
    return this.test.find({ teacher: id });
  }

  public async executePipeline(pipeline: any[]) {
    return this.test.aggregate(pipeline);
  }

  public async addTest(payload: ITest) {
    return this.test.create(payload);
  }
}
