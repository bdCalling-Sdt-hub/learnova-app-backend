import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { SubscriptionService } from "./subscription.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const subscriptionDetails = catchAsync(async (req: Request, res: Response)=>{
    const result = await SubscriptionService.subscriptionDetailsFromDB(req.user);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Subscription data retrieved Successfully",
        data: result
    })
});


const subscriptionsList = catchAsync(async (req: Request, res: Response)=>{
    const result = await SubscriptionService.getSubscriptionFromDB(req.query);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Subscription data retrieved Successfully",
        data: result
    })
});

export const SubscriptionController = {subscriptionDetails, subscriptionsList}