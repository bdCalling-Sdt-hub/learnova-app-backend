import { model, Schema } from "mongoose";
import { ISubscription, SubscriptionModel } from "./subscription.interface";


const subscriptionSchema = new Schema<ISubscription, SubscriptionModel>(
    {
        priceAmount: {
            type: Number,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        package: {
            type: Schema.Types.ObjectId,
            ref: "Package",
            required: true
        },
        priceId: {
            type: String,
            required: true
        },
        transactionId: {
            type: String,
            required: true
        },
        subscribeId: {
            type: String,
            required: true
        },
        currentPeriodStart: {
            type: String,
            required: true
        },
        currentPeriodEnd: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["expired", "active", "cancel"],
            default: "active",
            required: true
        },

    },
    {
        timestamps: true
    }
)

export const Subscription = model<ISubscription, SubscriptionModel>("Subscription", subscriptionSchema)