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
    const result = await UserService.createUserToDB(userData);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'User created successfully',
        data: result
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
    
    const profile = createMediaPath(req.files as FileWithMedia);

    const data = {
        profile,
        ...req.body,
    };
    const result = await UserService.updateProfileToDB(user, data);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Profile updated successfully',
        data: result
    });
});

//update profile
const teacherProfile = catchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const result = await UserService.teacherProfileFromDB(user);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Teacher Profile Retrieved successfully',
        data: result
    });
});

export const UserController = { 
    createUser,
    getUserProfile, 
    updateProfile,
    teacherProfile
};