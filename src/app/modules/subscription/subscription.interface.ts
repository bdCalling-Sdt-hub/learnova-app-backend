import { Model, Types } from 'mongoose';

export type ISubscription = {
    priceAmount: number;
    user: Types.ObjectId;
    package: Types.ObjectId;
    priceId: string;
    transactionId: string;
    subscribeId: string;
    status: 'expired' | 'active' | 'cancel';
    currentPeriodStart: string;
    currentPeriodEnd: string;
};

export type SubscriptionModel = Model<ISubscription, Record<string, unknown>>;