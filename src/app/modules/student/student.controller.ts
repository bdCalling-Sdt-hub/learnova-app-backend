import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../shared/sendResponse";
import { StudentService } from "./student.service";
import catchAsync from "../../../shared/catchAsync";
import { Request, Response } from "express";

const updateStudent = catchAsync(async(req: Request, res: Response)=>{
    
    const result = await StudentService.updateStudentToDB(req.user, req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Student Updated Successfully",
        data: result
    })
})

const studentProfile = catchAsync(async(req: Request, res: Response)=>{
    
    const result = await StudentService.studentProfileFromDB(req.user);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Student Profile Retrieved Successfully",
        data: result
    })
});


export const StudentController = {
    updateStudent,
    studentProfile
}