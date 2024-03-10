import Notification from '@src/dao/model/notifications';
import { INotifications, INotificationsDoc } from '@src/types/notifications';

export class NotificationRepo {
  notification: typeof Notification;

  constructor(){
    this.notification = Notification;
  }

  public createNotification(
    notification: Omit<INotifications, 'read' | 'createdAt' | 'updatedAt'>
  ): Promise<INotificationsDoc> {
    return this.notification.create(notification);
  }
}
