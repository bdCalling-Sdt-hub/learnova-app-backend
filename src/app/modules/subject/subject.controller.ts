import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { SubjectService } from "./subject.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";


// subject created
const createSubject = catchAsync(async (req: Request, res: Response) => {
    const result = await SubjectService.createSubjectToDB(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Subject created Successfully",
        data: result
    })
});


// retrieved all subject
const getSubject = catchAsync(async (req: Request, res: Response) => {
    const result = await SubjectService.getSubjectFromDB();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Subject Retrieved Successfully",
        data: result
    })

})

// delete a single subject
const deleteSubject = catchAsync(async (req: Request, res: Response) => {

    const result = await SubjectService.deleteSubjectToDB(req.params.id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Subject Deleted Successfully",
        data: result
    })
});

export const SubjectController = {
    createSubject,
    getSubject,
    deleteSubject
}