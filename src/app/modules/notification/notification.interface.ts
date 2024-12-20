import { Model, Types } from 'mongoose';

export type INotification = {
  title: string;
  message: string;
  user: Types.ObjectId;
  read: boolean;
  direction: "Student" | "Teacher" | "Subscription";
};

export type NotificationModel = Model<INotification>;
