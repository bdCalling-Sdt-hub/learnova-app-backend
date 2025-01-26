import { Model } from "mongoose";


export type IPackage = {
    title: String;
    description: String;
    price: Number;
    duration: 'month' | 'year';
    feature: [String];
    productId: String;
    paymentLink?: string;
}

export type PackageModel = Model<IPackage, Record<string, unknown>>;