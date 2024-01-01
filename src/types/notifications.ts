import mongoose from "mongoose";
import { Model } from "mongoose";

export interface INotifications{
    role: string; // kis role se aayi hai
    message: string;
    read: boolean;
    type: string; // "task_assigned", "order_completed"
    priority: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface INotificationsDoc extends INotifications, Document {}
export interface INotificationsModel extends Model<INotificationsDoc> {}


export interface INotificationUserRef{
    notification: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface INotificationUserRefDoc extends INotificationUserRef, Document {}
export interface INotificationUserRefModel extends Model<INotificationUserRefDoc> {}

export const enum Priority{
    Highest = "highest",
    High = "high",
    Medium = "medium",
    Low = "low"
}

export enum NotificationType{

}

