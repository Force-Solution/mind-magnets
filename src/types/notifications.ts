import mongoose from "mongoose";
import { Model } from "mongoose";

export interface INotifications{
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
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


export const enum Priority{
    Highest = "highest",
    High = "high",
    Medium = "medium",
    Low = "low"
}

export enum NotificationType{
    USER_ADDITION = "User_Addition"
}

