import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { RuleService } from './rule.service';

//terms and conditions
const createTermsAndCondition = catchAsync( async (req: Request, res: Response) => {
    const { ...termsData } = req.body
    const result = await RuleService.createTermsAndConditionToDB(termsData)
  
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Terms and conditions created successfully',
        data: result
    })
})
  
const getTermsAndCondition = catchAsync(async (req: Request, res: Response) => {
    const result = await RuleService.getTermsAndConditionFromDB()
  
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Terms and conditions retrieved successfully',
        data: result
    })
})

export const RuleController = {
    createTermsAndCondition,
    getTermsAndCondition
}  