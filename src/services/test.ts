import { TestRepo } from '@src/dao/repository/TestRepo';
import { ITest } from '@src/types/test';
import { TYPES } from '@src/types/types';
import { inject, injectable } from 'inversify';
import mongoose from 'mongoose';
import { BatchService } from './batch';
import { ClassService } from './class';
import { UserService } from './user';
@injectable()
export class TestService {
  constructor(
    @inject(TYPES.TestRepo) private test: TestRepo,
    @inject(TYPES.BatchService) private batch: BatchService,
    @inject(TYPES.UserService) private user: UserService,
    @inject(TYPES.ClassService) private classes: ClassService,
  ) {}

  public async countAllTestsByTeacher(id: mongoose.Types.ObjectId | undefined) {
    if (!id) return 0;
    const allTests = await this.test.getAllTestsByTeacher(id);
    return allTests.length;
  }

  public async getAveragePerformanceByTeacher(
    teacherId: mongoose.Types.ObjectId,
  ) {
    const pipeline = [
      {
        $lookup: {
          from: 'marks',
          localField: '_id',
          foreignField: 'test',
          as: 'TestMarksCombined',
        },
      },
      {
        $unwind: '$TestMarksCombined',
      },
      {
        $match: {
          teacher: teacherId,
        },
      },
      {
        $group: {
          _id: '$TestMarksCombined.student',
          totalMarks: { $sum: '$TestMarksCombined.marksObtained' },
          totalMaximumMarks: { $sum: '$maximumMarks' },
          totalTests: { $sum: 1 },
        },
      },
      {
        $addFields: {
          overallPercentage: {
            $multiply: [
              { $divide: ['$totalMarks', '$totalMaximumMarks'] },
              100,
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          overallAverage: { $avg: '$overallPercentage' },
        },
      },
      {
        $project: {
          _id: 0,
          overallAverage: 1,
        },
      },
    ];
    const result = await this.test.executePipeline(pipeline);
    return result.length === 0 ? 0 : result[0].overallAverage;
  }

  public async createTest(payload: any, userId: string) {
    const userDoc = await this.user.getUserByUserId(userId);
    const classDoc = await this.classes.getClassByClassName(payload.class);
    const batchDoc = await this.batch.getBatchByName(payload.batch);

    const newPayload: ITest = {
      ...payload,
      teacher: userDoc?._id,
      class: classDoc?._id,
      batch: batchDoc?._id,
    };

    return await this.test.addTest(newPayload);
  }
}
