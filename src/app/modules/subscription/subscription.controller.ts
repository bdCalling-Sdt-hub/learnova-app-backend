import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { SubscriptionService } from "./subscription.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createPaymentIntent = catchAsync(async (req: Request, res: Response)=>{
    const result = await SubscriptionService.createPaymentIntentToStripe(req.user, req.body.priceId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Create payment Intent Successfully",
        data: result
    })
});

const createSubscription = catchAsync(async (req: Request, res: Response)=>{

    const payload = {
        user: req.user.id,
        ...req.body
    }
    const result = await SubscriptionService.createSubscriptionToDB(payload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Create Subscription Successfully",
        data: result
    })
});

export const SubscriptionController = {
    createPaymentIntent,
    createSubscription
}