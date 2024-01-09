import { NotificationRepo } from '@src/dao/repository/NotificationRepo';
import {
  INotifications,
  NotificationType,
  Priority,
} from '@src/types/notifications';
import { IRole } from '@src/types/roles';
import mongoose from 'mongoose';

export const createNotification = async (
  sender: string | undefined,
  receiver: mongoose.Types.ObjectId,
  type: NotificationType,
  message: string,
) => {
  const base = {
    sender: new mongoose.Types.ObjectId(sender),
    receiver,
  };

  let payload: Omit<INotifications, 'read' | 'createdAt' | 'updatedAt'> =
    {} as INotifications;

  switch (type) {
    case NotificationType.USER_ADDITION:
      payload = {
        ...base,
        role: IRole.Admin,
        message,
        type,
        priority: Priority.Medium,
      };
      break;
    default:
      break;
  }

  return await new NotificationRepo().createNotification(payload);
};
