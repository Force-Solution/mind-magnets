export const getPendingPaymentsPerBatch = (paymentType: string) => {
    return  [
        {
          $lookup: {
            from: 'Batch',
            localField: 'batch',
            foreignField: '_id',
            as: 'studentBatchCombined',
          },
        },
        {
          $unwind: '$studentBatch',
        },
        {
          $lookup: {
            from: 'Payment',
            localField: '_id',
            foreignField: 'student',
            as: 'pendingPayment',
          },
        },
        {
          $unwind: '$pendingPayment',
        },
        {
          $unwind: {
            path: '$payment',
          },
        },
        {
          $match: {
            paymentType: paymentType,
            'pendingPayment.paid': false,
            'pendingPayment.dueDate': { $lte: new Date() },
          },
        },
        { $group: { _id: '$studentBatchCombined', count: { $sum: 1 } } },
        { $project: { _id: 0, batch: '$_id', count: '$count' } },
      ];
}

export const getWeeklyDataOfUserJoined = (
  lastWeekStartDate: Date,
  currentDate: Date,
): any[] => {
  return [
    {
      $match: {
        createdAt: { $gte: lastWeekStartDate, $lt: currentDate },
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: '$createdAt' },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        label: {
          $switch: {
            branches: [
              { case: { $eq: ['$_id', 1] }, then: 'Sunday' },
              { case: { $eq: ['$_id', 2] }, then: 'Monday' },
              { case: { $eq: ['$_id', 3] }, then: 'Tuesday' },
              { case: { $eq: ['$_id', 4] }, then: 'Wednesday' },
              { case: { $eq: ['$_id', 5] }, then: 'Thursday' },
              { case: { $eq: ['$_id', 6] }, then: 'Friday' },
              { case: { $eq: ['$_id', 7] }, then: 'Saturday' },
            ],
            default: null,
          },
        },
        count: 1,
      },
    },
  ];
};

export const getMonthlyDataOfUserJoined = (
  previousDate: Date,
  currentDate: Date,
): any[] => {
  return [
    {
      $match: {
        createdAt: { $gte: previousDate, $lt: currentDate },
      },
    },
    {
      $group: {
        _id: { $dayOfMonth: '$createdAt' },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        label: {
          $switch: {
            branches: [
              { case: { $eq: ['$_id', 1] }, then: 'January' },
              { case: { $eq: ['$_id', 2] }, then: 'February' },
              { case: { $eq: ['$_id', 3] }, then: 'March' },
              { case: { $eq: ['$_id', 4] }, then: 'April' },
              { case: { $eq: ['$_id', 5] }, then: 'May' },
              { case: { $eq: ['$_id', 6] }, then: 'June' },
              { case: { $eq: ['$_id', 7] }, then: 'July' },
              { case: { $eq: ['$_id', 8] }, then: 'August' },
              { case: { $eq: ['$_id', 9] }, then: 'September' },
              { case: { $eq: ['$_id', 10] }, then: 'October' },
              { case: { $eq: ['$_id', 11] }, then: 'November' },
              { case: { $eq: ['$_id', 12] }, then: 'December' },
            ],
            default: null,
          },
        },
        count: 1,
      },
    },
  ];
};
