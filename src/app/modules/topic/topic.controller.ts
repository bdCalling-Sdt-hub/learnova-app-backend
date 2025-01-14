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

const updateTopic = catchAsync(async (req: Request, res: Response)=>{
    const result = await TopicService.updateTopicToDB(req.params.id, req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Topic Updated Successfully",
        data: result
    })
});

const deleteTopic = catchAsync(async (req: Request, res: Response)=>{
    const result = await TopicService.deleteTopicToDB(req.params.id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Topic Updated Successfully",
        data: result
    })
});

const getTopicDetails = catchAsync(async (req: Request, res: Response)=>{
    const result = await TopicService.getTopicDetailsFromDB(req.params.id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Topic Details Retrieved Successfully",
        data: result
    })
});


export const TopicController = {
    createTopic,
    updateTopic,
    deleteTopic,
    getTopicDetails
}