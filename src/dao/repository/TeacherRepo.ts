import mongoose from 'mongoose';
import { ITeacher, ITeacherDoc } from '@src/types/teacher';
import Teacher from '@src/dao/model/teacher';
import * as Pipeline from '@src/dao/repository/pipelines';
import { Duration } from '@src/types/roles';
import { IRequest } from '@src/types/request';
import { removeUnwantedChars } from '@src/helper/util';

export class TeacherRepo {
  public saveTeacher(teacher: Partial<ITeacher>): Promise<ITeacherDoc> {
    return Teacher.create(teacher);
  }

  public countTeachersByDuration(
    duration: string,
  ): Promise<{ label: string; count: number }[]> {
    let pipeline = [];

    if (duration === Duration.Weekly) {
      const currentDate = new Date();
      const lastWeekDate = new Date(currentDate);
      lastWeekDate.setDate(currentDate.getDate() - 6);
      lastWeekDate.setHours(0, 0, 0, 0);

      pipeline = Pipeline.getWeeklyDataOfUserJoined(lastWeekDate, currentDate);
    } else if (duration === Duration.Monthly) {
      const currentDate = new Date();
      const previousDate = new Date(currentDate);
      previousDate.setMonth(currentDate.getMonth() - 11);
      previousDate.setHours(0, 0, 0, 0);
      previousDate.setDate(1);

      pipeline = Pipeline.getMonthlyDataOfUserJoined(previousDate, currentDate);
    }

    return Teacher.aggregate(pipeline);
  }

  public async getAllTeacherData(payload: Partial<IRequest>) {
    const requestObject: Pipeline.IOptions = {
      page: parseInt(payload.page ?? '0'),
      limit: parseInt(payload.size ?? '0'),
    };

    if (
      removeUnwantedChars(payload.sort).length &&
      removeUnwantedChars(payload.order).length
    ) {
      requestObject['sortBy'] = `${removeUnwantedChars(payload.sort)}:${removeUnwantedChars(payload.order)}`;
    }

    if (removeUnwantedChars(payload.search).length) {
      requestObject['searchBy'] = `userName:${removeUnwantedChars(payload.search)}:i`;
    }

    const userWithTeacherData = [
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userTeacherCombined",
        },
      },
      {
        $lookup:{
          from: "departments",
          localField: "department",
          foreignField: "_id",
          as: "teacherDeptCombined"
        },
      },
      {
        $lookup:{
          from: "posts",
          localField: "post",
          foreignField: "_id",
          as: "teacherPostCombined"
        }
      },
      {
        $unwind: "$userTeacherCombined",
      },
      {
        $unwind: "$teacherDeptCombined",
      },
      {
        $unwind: "$teacherPostCombined",
      },
      {
        $project: {
          firstName: "$userTeacherCombined.firstName",
          lastName: "$userTeacherCombined.lastName",
          userId: "$userTeacherCombined.userId",
          userName: "$userTeacherCombined.userName",
          department: "$teacherDeptCombined.department",
          post: "$teacherPostCombined.post",
          createdAt: "$createdAt",
        },
      },
    ];

    return Teacher.aggregate(
      Pipeline.paginate(userWithTeacherData, requestObject),
    );
  }
  // id -> teacher tbl container userId
  public async getTeacherFromUserId(id: mongoose.Types.ObjectId){
    return Teacher.findOne({user: id});
  }
}
