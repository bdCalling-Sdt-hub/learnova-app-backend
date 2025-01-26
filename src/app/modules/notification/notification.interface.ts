import { Model, Types } from 'mongoose';

export type INotification = {
  text: string;
  receiver?: Types.ObjectId;
  read: boolean;
  referenceId?: string;
  screen?: "REGISTER" | "SUBSCRIPTION";
  type?: "ADMIN";
};

export type NotificationModel = Model<INotification>;
