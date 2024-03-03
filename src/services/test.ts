import { TestRepo } from "@src/dao/repository/TestRepo";
import mongoose from "mongoose";

export const countAllTestsByTeacher = async (id: mongoose.Types.ObjectId |  undefined) => {
    if(!id) return 0;
    const allTests =  await new TestRepo().getAllTestsByTeacher(id);
    return allTests.length;
}

export const getAveragePerformanceByTeacher = async (teacherId: mongoose.Types.ObjectId) => {
    const pipeline = [
        {
            $lookup:{
              from: "marks",
              localField: "_id",
              foreignField: "test",
              as: "TestMarksCombined"
            }
        },
        {
            $unwind: "$TestMarksCombined",
        },
        {
            $match:{
                "teacher": teacherId
            }
        },
        {
            $group: {
              _id: '$TestMarksCombined.student',
              totalMarks: { $sum: '$TestMarksCombined.marksObtained' },
              totalMaximumMarks: { $sum: '$maximumMarks' },
              totalTests: { $sum: 1 }
            }
        },
        {
            $addFields: {
              overallPercentage: {
                $multiply: [
                  { $divide: ['$totalMarks', '$totalMaximumMarks'] },
                  100
                ]
              }
            }
          },
          {
            $group: {
              _id: null,
              overallAverage: { $avg: '$overallPercentage' }
            }
          },
          {
            $project: {
              _id: 0,
              overallAverage: 1
            }
          }
    ]
    const result =  await new TestRepo().executePipeline(pipeline);
    return result.length === 0 ?  0 : result[0].overallAverage;
}