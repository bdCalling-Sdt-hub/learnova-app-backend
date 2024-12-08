import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { BioService } from "./bio.service";

const createBio = catchAsync(async(req:Request, res: Response, next: NextFunction)=>{
    const user = req.user;

    const payload = {
        student: user.id,
        ...req.body
    }
    await BioService.createBioToDB(payload);
    

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Bio created Successfully"
    })
});

export const BioController = {
    createBio
}