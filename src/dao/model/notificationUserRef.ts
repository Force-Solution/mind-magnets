import {
  INotificationUserRefDoc,
  INotificationUserRefModel,
} from '@src/types/notifications';
import { Schema, model } from 'mongoose';

const schema = new Schema<INotificationUserRefDoc, INotificationUserRefModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    notification: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Notification',
    },
  },
  { timestamps: true },
);

const NotificationsReference = model<
  INotificationUserRefDoc,
  INotificationUserRefModel
>('NotificationsReference', schema);

export default NotificationsReference;
