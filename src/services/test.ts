import { TestRepo } from '@src/dao/repository/TestRepo';
import mongoose from 'mongoose';

export class TestService {
  test: TestRepo;

  constructor() {
    this.test = new TestRepo();
  }

  public async countAllTestsByTeacher(id: mongoose.Types.ObjectId | undefined) {
    if (!id) return 0;
    const allTests = await this.test.getAllTestsByTeacher(id);
    return allTests.length;
  }

  public async getAveragePerformanceByTeacher(teacherId: mongoose.Types.ObjectId) {
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
}
