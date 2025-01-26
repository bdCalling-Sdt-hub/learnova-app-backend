import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from './user.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { createMediaPath } from '../../../helpers/createMediaPathHelper';
import { FileWithMedia } from '../../../types/imagePath';

// register user
const createUser = catchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const { ...userData } = req.body;
    await UserService.createUserToDB(userData);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Please check your email to verify your account. We have sent you an OTP to complete the registration process.',
    })
});

// retrieved user profile
const getUserProfile = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await UserService.getUserProfileFromDB(user);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Profile data retrieved successfully',
        data: result
    });
});

//update profile
const updateProfile = catchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const result = await UserService.updateProfileToDB(user, req.body);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Profile updated successfully',
        data: result
    });
});

const teacherHomeProfile = catchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.teacherHomeProfileFromDB(req.user);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Teacher Profile Retrieved successfully',
        data: result
    });
});

const teacherProfile = catchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.teacherProfileFromDB(req.user);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Teacher Profile Retrieved successfully',
        data: result
    });
});

//update profile
const studentProfile = catchAsync( async (req: Request, res: Response) => {
    const result = await UserService.studentProfileFromDB(req.user);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Student Profile Retrieved successfully',
        data: result
    });
});

export const UserController = { 
    createUser,
    getUserProfile, 
    updateProfile,
    teacherHomeProfile,
    teacherProfile,
    studentProfile
};