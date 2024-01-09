import {
  INotificationsDoc,
  INotificationsModel,
  NotificationType,
  Priority,
} from '@src/types/notifications';
import { IRole } from '@src/types/roles';
import { Schema, model } from 'mongoose';

const schema = new Schema<INotificationsDoc, INotificationsModel>(
  {
    sender:{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver:{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: [IRole.Admin, IRole.Teacher, IRole.Parent, IRole.Student],
      trim: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      required: true,
      enum: [...Object.values(NotificationType)],
    },
    priority: {
      type: String,
      required: true,
      enum: [Priority.Highest, Priority.High, Priority.Medium, Priority.Low],
    },
  },
  { timestamps: true },
);

const Notification = model<INotificationsDoc, INotificationsModel>('Notifications', schema);

export default Notification;