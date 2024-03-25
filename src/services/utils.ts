export const getClassesForTeacherRole = (userId: number) => {
  return [
    {
      $lookup: {
        from: "users",
        localField: "teacher",
        foreignField: "_id",
        as: "classTeacherCombined",
      },
    },
    {
      $lookup: {
        from: "batches",
        localField: "batch",
        foreignField: "_id",
        as: "classBatchCombined",
      },
    },
    {
      $unwind: "$classTeacherCombined",
    },
    {
      $unwind: "$classBatchCombined",
    },
    {
      $match: {
        $expr: {
          $eq: ["$classTeacherCombined.userId", userId],
        },
      },
    },
    {
      $project: {
        name: "$name",
        students: "$students",
        createdAt: "$createdAt",
        description: "$description",
        backgroundImg: "$backgroundImg",
        logoImg: "$logoImg",
        startTime: "$startTime",
        endTime: "$endTime",
        teacher: {
            "$concat": ["$classTeacherCombined.firstName", " ", "$classTeacherCombined.lastName"]
        },
        batch: "$classBatchCombined.name",
      },
    },
  ];
};
