import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import { ISubscription } from "./subscription.interface";
import { Subscription } from "./subscription.model";
import { Package } from "../package/package.model";
import QueryBuilder from "../../../helpers/apiFeature";

const subscriptionDetailsFromDB = async (user: JwtPayload): Promise<ISubscription> => {
    const subscription = await Subscription.findOne({ user: user.id });
    if (!subscription) throw new ApiError(StatusCodes.BAD_REQUEST, "No subscription found");
    return subscription;
}

const getSubscriptionFromDB = async (query: Record<string, any>) => {

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const subscriptionsArray = Array.from(
        { length: 12 },
        (_, i) => (
            {
                month: monthNames[i],
                monthly: 0,
                yearly: 0,
            }
        )
    );


    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);


    const subscriptionStatistics = await Subscription.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lt: endDate }
            }
        },
        {
            $group: {
                _id: {
                    month: { $month: "$createdAt" },
                    duration: "$package.duration"
                },
                monthly: { $sum: 1 },
                yearly: { $sum: { $cond: [{ $eq: [{ $year: "$createdAt" }, now.getFullYear()] }, 1, 0] } }
            }
        }
    ]);

    // Update subscriptionsArray with the calculated statistics
    subscriptionStatistics.forEach((stat) => {
        const monthIndex = stat._id.month - 1; // Month is 1-indexed
        if (monthIndex < subscriptionsArray.length) {
            if (stat._id.duration === 'month') {
                subscriptionsArray[monthIndex].monthly += stat.monthly;
            } else if (stat._id.duration === 'year') {
                subscriptionsArray[monthIndex].yearly += stat.yearly;
            }
        }
    });

    const packages = await Package.find();

    const apiFeatures = new QueryBuilder(Subscription.find(), query).paginate();
    const subscriptions = await apiFeatures.queryModel;
    const pagination = await apiFeatures.getPaginationInfo();



    return {
        subscriptionsArray,
        packages,
        subscriptions,
        pagination
    };
}



export const SubscriptionService = {
    subscriptionDetailsFromDB,
    getSubscriptionFromDB
} 