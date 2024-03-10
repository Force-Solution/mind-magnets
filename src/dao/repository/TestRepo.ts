import mongoose from 'mongoose';
import Test from '../model/test';
import { injectable } from 'inversify';
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
}
