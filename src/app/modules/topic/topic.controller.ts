import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { TopicService } from "./topic.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createTopic = catchAsync(async (req: Request, res: Response)=>{
    const result = await TopicService.createTopicToDB(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Topic Created Successfully",
        data: result
    })
});


export const TopicController = {
    createTopic
}