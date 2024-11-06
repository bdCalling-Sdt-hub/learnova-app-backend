import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { FollowingService } from "./following.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";


const toggleFollowing = catchAsync(async(req:Request, res:Response)=>{

    const payload = {
        student: req.user.id,
        ...req.body
    }
    const result = await FollowingService.toggleFollowingToDB(payload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: result
    })
});

const followingCount = catchAsync(async(req:Request, res:Response)=>{

    const result = await FollowingService.followingCountFromDB(req.user,  req.params.id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Course Followers Count Retrieved Successfully",
        data: result
    })
});


export const FollowingController = {
    toggleFollowing,
    followingCount
}