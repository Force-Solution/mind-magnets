import Notification from '@src/dao/model/notifications';
import { INotifications, INotificationsDoc } from '@src/types/notifications';

export class NotificationRepo {
  public createNotification(
    notification: Omit<INotifications, 'read' | 'createdAt' | 'updatedAt'>
  ): Promise<INotificationsDoc> {
    return Notification.create(notification);
  }
}
